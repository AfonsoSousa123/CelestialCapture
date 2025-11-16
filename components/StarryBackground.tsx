import React from 'react';

// Pre-generated random star positions for performance.
const shadowsSmall = '1238px 1152px #FFF, 126px 1471px #FFF, 1832px 1475px #FFF, 1222px 126px #FFF, 1032px 1275px #FFF, 1538px 119px #FFF, 1258px 1018px #FFF, 32px 1431px #FFF, 1282px 556px #FFF, 946px 1285px #FFF, 128px 1461px #FFF, 1026px 832px #FFF, 810px 1018px #FFF, 1696px 1978px #FFF, 1618px 439px #FFF, 100px 1863px #FFF, 1422px 214px #FFF, 1264px 1211px #FFF, 219px 735px #FFF, 810px 792px #FFF, 1989px 40px #FFF, 166px 1581px #FFF, 62px 1589px #FFF, 887px 830px #FFF, 1855px 338px #FFF, 1869px 1318px #FFF, 1073px 1819px #FFF, 1400px 317px #FFF, 290px 107px #FFF, 1184px 1757px #FFF, 1108px 101px #FFF, 1839px 1243px #FFF, 281px 1187px #FFF, 1213px 1982px #FFF, 477px 1172px #FFF, 175px 1547px #FFF, 420px 1913px #FFF, 1519px 125px #FFF, 1689px 1774px #FFF, 1145px 1238px #FFF, 1833px 131px #FFF, 1137px 1261px #FFF, 381px 185px #FFF, 1883px 129px #FFF, 1735px 76px #FFF, 1881px 1795px #FFF, 115px 1667px #FFF, 1851px 37px #FFF, 1419px 1993px #FFF, 255px 505px #FFF';
const shadowsMedium = '1504px 1475px #FFF, 938px 1488px #FFF, 1668px 1403px #FFF, 137px 229px #FFF, 1438px 653px #FFF, 1345px 1324px #FFF, 1473px 1957px #FFF, 712px 1604px #FFF, 1963px 1902px #FFF, 584px 93px #FFF, 1941px 1945px #FFF, 106px 1818px #FFF, 1888px 1027px #FFF, 1024px 621px #FFF, 553px 1239px #FFF';
const shadowsLarge = '1454px 1589px #FFF, 1545px 1138px #FFF, 933px 132px #FFF, 1537px 1159px #FFF, 1751px 1630px #FFF';


const StarryBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0c0a18]">
            <div id="stars1" className="stars"></div>
            <div id="stars2" className="stars"></div>
            <div id="stars3" className="stars"></div>
            <style>{`
                .stars {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 1px;
                  height: 1px;
                  background: transparent;
                  animation-iteration-count: infinite;
                  animation-timing-function: linear;
                  animation-name: animStar;
                }

                #stars1 {
                  animation-duration: 50s;
                  box-shadow: ${shadowsSmall};
                }

                #stars2 {
                  animation-duration: 100s;
                  box-shadow: ${shadowsMedium};
                }
                
                #stars3 {
                  width: 2px;
                  height: 2px;
                  animation-duration: 150s;
                  box-shadow: ${shadowsLarge};
                }

                @keyframes animStar {
                  from {
                    transform: translateY(0px);
                  }
                  to {
                    transform: translateY(-2000px);
                  }
                }
            `}</style>
        </div>
    );
};

export default StarryBackground;
