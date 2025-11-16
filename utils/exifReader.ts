// A simple, dependency-free EXIF reader.
// Adapted from various open-source snippets.

export interface ExifData {
    width?: number;
    height?: number;
    iso?: string;
    aperture?: string;
    exposureTime?: string;
}

const ExifTags: Record<number, string> = {
    // Tiff tags
    0x0112: "Orientation",
    // Exif IFD
    0x8769: "ExifIFDPointer",
    // Exif Tags
    0x8827: "ISOSpeedRatings",
    0x9202: "ApertureValue",
    0x829A: "ExposureTime",
    0x829D: "FNumber",
    0xA002: "PixelXDimension",
    0xA003: "PixelYDimension",
};

const TiffTags: Record<number, string> = {
    0x0112: "Orientation",
};

// FIX: Helper function to read string from DataView, replacing prototype extension.
function getStringFromDataView(view: DataView, length: number, offset: number): string {
    let str = "";
    for (let i = 0; i < length; i++) {
        str += String.fromCharCode(view.getUint8(offset + i));
    }
    return str;
}


function findEXIFinJPEG(file: ArrayBuffer): Record<string, any> {
    const dataView = new DataView(file);

    if (dataView.getUint8(0) !== 0xFF || dataView.getUint8(1) !== 0xD8) {
        return {}; // Not a valid JPEG
    }

    let offset = 2;
    const length = file.byteLength;
    let marker;

    while (offset < length) {
        if (dataView.getUint8(offset) !== 0xFF) {
            return {}; // Corrupted JPEG
        }

        marker = dataView.getUint8(offset + 1);

        if (marker === 0xE1) { // APP1 marker for EXIF
            return readEXIFData(dataView, offset + 4);
        } else {
            offset += 2 + dataView.getUint16(offset + 2);
        }
    }
    return {};
}

function readTags(file: DataView, tiffStart: number, dirStart: number, strings: Record<number, string>, bigEnd: boolean) {
    const entries = file.getUint16(dirStart, !bigEnd);
    const tags: Record<string, any> = {};
    let entryOffset;

    for (let i = 0; i < entries; i++) {
        entryOffset = dirStart + i * 12 + 2;
        const tag = strings[file.getUint16(entryOffset, !bigEnd)];
        if (tag) {
            tags[tag] = readTagValue(file, entryOffset, tiffStart, bigEnd);
        }
    }
    return tags;
}

function readTagValue(file: DataView, entryOffset: number, tiffStart: number, bigEnd: boolean) {
    const type = file.getUint16(entryOffset + 2, !bigEnd);
    const numValues = file.getUint32(entryOffset + 4, !bigEnd);
    const valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
    
    switch (type) {
        case 3: // SHORT
            if (numValues === 1) {
                return file.getUint16(entryOffset + 8, !bigEnd);
            }
            break;
        case 4: // LONG
            if (numValues === 1) {
                return file.getUint32(entryOffset + 8, !bigEnd);
            }
            break;
        case 5: // RATIONAL
            if (numValues === 1) {
                const numerator = file.getUint32(valueOffset, !bigEnd);
                const denominator = file.getUint32(valueOffset + 4, !bigEnd);
                if (denominator === 0) return 0;
                return numerator / denominator;
            }
            break;
    }
}


function readEXIFData(file: DataView, start: number) {
    // FIX: Use the helper function instead of the non-standard prototype method.
    if (getStringFromDataView(file, 4, start) !== "Exif") {
        return {};
    }

    let bigEnd;
    const tiffOffset = start + 6;

    if (file.getUint16(tiffOffset) === 0x4949) {
        bigEnd = false;
    } else if (file.getUint16(tiffOffset) === 0x4D4D) {
        bigEnd = true;
    } else {
        return {}; // Not valid TIFF data
    }

    if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002A) {
        return {}; // Not valid TIFF data
    }

    const firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
    if (firstIFDOffset < 0x00000008) {
        return {};
    }
    
    const tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

    if (tags.ExifIFDPointer) {
        const exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
        for (const tag in exifData) {
            tags[tag] = exifData[tag];
        }
    }

    return tags;
}

// FIX: Removed non-standard extension of DataView.prototype
/*
DataView.prototype.getString = function(length: number, offset: number) {
    let str = "";
    for (let i = 0; i < length; i++) {
        str += String.fromCharCode(this.getUint8(offset + i));
    }
    return str;
};
*/
export const readExifData = (file: File): Promise<ExifData> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            if (!buffer) {
                resolve({});
                return;
            }
            try {
                const tags = findEXIFinJPEG(buffer);

                const exposureTime = tags.ExposureTime;
                let exposureTimeString: string | undefined;
                if (exposureTime && exposureTime > 0) {
                    if (exposureTime < 1) {
                        exposureTimeString = `1/${Math.round(1 / exposureTime)} s`;
                    } else {
                        exposureTimeString = `${exposureTime} s`;
                    }
                }

                const fNumber = tags.FNumber;
                let apertureString: string | undefined;
                if (fNumber) {
                    apertureString = `f/${fNumber}`;
                }

                resolve({
                    width: tags.PixelXDimension,
                    height: tags.PixelYDimension,
                    iso: tags.ISOSpeedRatings ? String(tags.ISOSpeedRatings) : undefined,
                    aperture: apertureString,
                    exposureTime: exposureTimeString,
                });
            } catch (error) {
                console.error("Error parsing EXIF data:", error);
                resolve({}); // Resolve with empty object on parsing error
            }
        };
        reader.onerror = () => resolve({}); // Resolve with empty on file read error
        reader.readAsArrayBuffer(file);
    });
};
