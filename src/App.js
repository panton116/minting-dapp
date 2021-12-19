import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 400px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  //const [feedback, setFeedback] = useState(`Attention: Free Magic Pawns are reserved for new owners only, if you already own a Magic Pawn, your minting will fail and you will lose some gas fee.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [timematch, SetTimematch] = useState(false);
  const [today, setToday] = useState(0);
  const [startdate, setstartdate] = useState(0);
  const [_COST, SET_COST] = useState(0);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST1: 0,
    WEI_COST2: 0,
    WEI_COST3: 0,
    WEI_COST4: 0,
    WEI_COST5: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
    DROP_DATE: "",
  });
  const calculatedatetime = () => {
    let today = new Date();
    let startdate = new Date(CONFIG.DROP_DATE);
    // CONFIG.DROP_YEAR, CONFIG.DROP_MONTH, CONFIG.DROP_DAY, CONFIG.DROP_HOUR, CONFIG.DROP_MIN, CONFIG.DROP_SEC

    if (today.getTime() >= startdate.getTime()) {
      SetTimematch(true);
    }
    else{
      SetTimematch(false)
    }
    setToday(today.getTime());
    setstartdate(startdate.getTime());
  };

  const claimNFTs = () => {
    let cost = _COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Error! Please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Congratulations! ${CONFIG.NFT_NAME} is yours! Visit Opensea.io to view them (give it a few minute to load).`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 4) {
      newMintAmount = 4;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  // const getenable = async () => {
  //   const enableResponse = await fetch("/config/enable.json");
  //   const enable = await enableResponse.json();
  //   setenable(enable);
  // };      

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Link rel="preconnect" href="https://fonts.googleapis.com"/>
      <s.Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <s.Link  href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Infant&family=Sorts+Mill+Goudy&family=Zen+Kaku+Gothic+Antique:wght@400;500&display=swap" rel="stylesheet" />
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "#07131c" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.jpg" : null}
      >

        <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        <s.SpacerSmall />
        {/* <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
            
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--accent-text)",
                maxWidth: 900,
              }}>
              Welcome to Johanna's Magic school, where 5555 Magic Pawns reside, study and practice all kinds of mystical magic. The pawns are made of Sugar, Spice and Everything nice! Each of them is uniquely different, but they are all so sweet and full of love. Though sometimes they can be a little spicy. So pick your pawns carefully to suit your style!
            </s.TextDescription>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--accent-text)",
              }}>
              This collection is original, was made by Johanna Phan, and will never be minted again!
            </s.TextDescription>
            <s.TextDescription
              style={{
                textAlign: "center",
                fontWeight: "bold",
                color: "var(--secondary)",
              }}>
              Since they are magical creatures. Nobody knows what they are cabable of. Perhaps evolution? Or summoning something? Only time will tell!
            </s.TextDescription>
          </s.Container> */}
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          {
            /*
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg alt={"example"} src={"/config/images/example.gif"} />
            </s.Container>
            

            */
          }
          <s.Container flex={1}>
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "rgba(0,0,0,0.85)",
              padding: 24,
              borderRadius: 12,
              border: "1px solid #ffe56a",
              boxShadow: "0px 0px 10px 2px #ee6518",
              padding: "24px 60px 40px 60px",
            }}
          >

            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                
                
              }}
            >

              Demons unleased:
            </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                
                color: "#b43712",
              }}
            >
              {data.totalSupply==0? '???': data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.SpacerSmall />


            {/* sale over */}


            {


              Number(data.totalSupply) >= Number(CONFIG.MAX_SUPPLY) ? (
                <>
                  <s.TextTitle
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    Sold out.
                  </s.TextTitle>
                  <s.TextDescription
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    Check out the collection on
                  </s.TextDescription>
                  <s.SpacerSmall />
                  <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </StyledLink>
                </>
              ) : (
                <>
                  <s.TextTitle2
                    style={{ textAlign: "center", }}
                  >
                    {timematch}
                    Price: {_COST/1000000000000000000} {CONFIG.NETWORK.SYMBOL} (per demon)
                    {/* 1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}{CONFIG.NETWORK.SYMBOL}. */}

                  </s.TextTitle2>
                  <s.Hr/>
                  <s.SpacerXSmall />
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <s.StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                          
                          setFeedback(timematch?`Ready! Click Mint to get your NFT now.`:`The drop starts on ${CONFIG.DROP_DATE}`);
                          // setFeedback(`The drop starts on ${CONFIG.DROP_DATE}`);
                        }}
                      >
                        CONNECT

                      </s.StyledButton>
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>

                  ) : (
                    <>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                         
                        }}
                      >
                        {feedback}
                      </s.TextDescription>

                      <s.SpacerMedium />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledRoundButton
                          style={{ lineHeight: 0.4 }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          -
                        </StyledRoundButton>
                        <s.SpacerMedium />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {mintAmount}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <StyledRoundButton
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          +
                        </StyledRoundButton>
                      </s.Container>
                      <s.SpacerSmall />

                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <s.StyledButton
                          disabled={claimingNft ? 1 : (timematch ? 0 : 1)}

                          onClick={(e) => {
                            e.preventDefault();
                            claimNFTs();
                            getData();
                          }}
                        >

                          {claimingNft ? "BUSY" : timematch ? "MINT" : "The drop hasn't started yet"}
                        </s.StyledButton>

                      </s.Container>


                    </>
                  )}
                </>
              )}

            <s.SpacerLarge />
            {/* <s.TextDescription
              style={{
                textAlign: "center",
                maxWidth: 600,
              }}
            >Please note: Free {CONFIG.NFT_NAME}s are reserved for new owners only, if you already own a {CONFIG.NFT_NAME}, your mint will fail and you will lose some gas fee.
            </s.TextDescription> */}
            <s.SpacerSmall />
            <s.StyledLink target={"_blank"} href={null}>
                Your Wallet: {blockchain.account!=null? truncate(blockchain.account, 50):"Not Connected"}
            </s.StyledLink>
            <s.StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                Contract address: {truncate(CONFIG.CONTRACT_ADDRESS, 50)}
            </s.StyledLink>

          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1}></s.Container>
          {
            /*
            <s.Container flex={1} jc={"center"} ai={"center"}>
              <StyledImg
                alt={"example"}
                src={"/config/images/example.gif"}
                style={{ transform: "scaleX(-1)" }}
              />
            </s.Container>

            */
          }
        </ResponsiveWrapper>
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#ffc24c",
            }}
          >
            Check out the NFT collection here:
          </s.TextDescription>
          <s.StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE_LINK}
          </s.StyledLink>
          <s.SpacerSmall/>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#ffc24c",
            }}
          >
            ©Lance's Demon Army 
          </s.TextDescription>
          
        </s.Container>
      </s.Container>
      {setTimeout(() => {
        SET_COST(CONFIG.WEI_COST1);
        calculatedatetime();
      }, 500)}
    </s.Screen>
  );
}

export default App;
