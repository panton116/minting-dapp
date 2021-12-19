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
    ENABLE: true,
  });

  const calculatedatetime = () =>{
    let today = new Date();
    let startdate = new Date(2021, 12, 25, 0, 0, 0);
    if (today.getTime() >= startdate.getTime()) {
      SetTimematch(true);
      setToday(today.getTime());
      setstartdate(startdate.getTime());
    }
    if(CONFIG.ENABLE==true){
      SetTimematch(true);}
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
        setFeedback("Oops, your mint was unsuccessful. Please try again.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW!!!!!! The ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it (maybe give it a minute to update).`
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

  const getData = (a) => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      console.log(a);
    }
    // setTimeout(() => {
    //   let supply = data.totalSupply
    //   SET_COST( supply <= 200 ? CONFIG.WEI_COST1 : CONFIG.WEI_COST2);
    // }, 2000);
  };

  // const getCost = (callback) => {
  //   callback(1);
  //   SET_COST( data.totalSupply <= 200 ? CONFIG.WEI_COST1 : CONFIG.WEI_COST2);
  // }

  

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
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.jpg" : null}
      >
        
        <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
        
        <s.SpacerSmall />
          
        <s.SpacerSmall />
        <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                  Contract address: {
                  truncate(CONFIG.CONTRACT_ADDRESS, 50)}
        </StyledLink>
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example1"} src={"/config/images/example1.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
            ><s.TextTitle
            style={{
              textAlign: "center",
              fontSize: 50,
              fontWeight: "bold",
              color: "var(--accent-text)",
            }}
          >
            
            Magic Pawns on the loose:
          </s.TextTitle>
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              
              {data.totalSupply==0? '1xx': data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              
            </s.TextDescription>
            

            

            <s.SpacerSmall />
          

            {/* sale over */}
            {
            Number(data.totalSupply) >= 5555 ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Sold out.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (   
              <> 
              

                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  {mintAmount} Magic Pawn = {_COST==0? '?':mintAmount*_COST/1000000000000000000} {CONFIG.NETWORK.SYMBOL}
                  {/* 1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}. */}
                  
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Price range:
                </s.TextDescription>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  *** 0 --> 100: Free ***
                </s.TextDescription>
                <s.TextDescription
                  style={{ textAlign: "center", color: _COST==CONFIG.WEI_COST1? "#ff23bd" : "var(--accent-text)", fontWeight: _COST==CONFIG.WEI_COST1? "bold":null }}
                >
                  *** 101 --> 200: {CONFIG.WEI_COST1/1000000000000000000} {CONFIG.NETWORK.SYMBOL} ***
                </s.TextDescription>
                <s.TextDescription
                  style={{ textAlign: "center", color: _COST==CONFIG.WEI_COST2? "#ff23bd" : "var(--accent-text)", fontWeight: _COST==CONFIG.WEI_COST2? "bold":null }}
                >
                  *** 201 --> 500: {CONFIG.WEI_COST2/1000000000000000000} {CONFIG.NETWORK.SYMBOL} ***
                </s.TextDescription>
                <s.TextDescription
                  style={{ textAlign: "center", color: _COST==CONFIG.WEI_COST3? "#ff23bd" : "var(--accent-text)", fontWeight: _COST==CONFIG.WEI_COST3? "bold":null }}
                >
                  *** 501 --> 1000: {CONFIG.WEI_COST3/1000000000000000000} {CONFIG.NETWORK.SYMBOL} ***
                </s.TextDescription>
                <s.TextDescription
                  style={{ textAlign: "center", color: _COST==CONFIG.WEI_COST4? "#ff23bd" : "var(--accent-text)", fontWeight: _COST==CONFIG.WEI_COST4? "bold":null }}
                >
                  *** 1001 --> 2000: {CONFIG.WEI_COST4/1000000000000000000} {CONFIG.NETWORK.SYMBOL} ***
                </s.TextDescription>
                <s.TextDescription
                  style={{ textAlign: "center", color: _COST==CONFIG.WEI_COST5? "#ff23bd" : "var(--accent-text)", fontWeight: _COST==CONFIG.WEI_COST5? "bold":null }}
                >
                  *** 2001 --> 5555: {CONFIG.WEI_COST5/1000000000000000000}+ {CONFIG.NETWORK.SYMBOL} ***
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                        calculatedatetime();
                        setFeedback(`Click MINT to mint your Magic Pawn.`);
                      }}
                    >
                      CONNECT
                      
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          Please{' '}
                          <StyledLink target={"_blank"} href={'https://metamask.io/'}>
                           {blockchain.errorMsg}
                        </StyledLink>
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                  
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
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
                          getData();
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
                          getData();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : (timematch? 0:1)}
                        
                        onClick={(e) => {
                          e.preventDefault();
                          getData();
                          setTimeout(() => {
                            claimNFTs();
                          }, 1000); 
                        }}
                      >
                        
                        {claimingNft ? "BUSY" : timematch? "MINT" : "The sale hasn't started yet"}
                      </StyledButton>
                      
                    </s.Container>
                    
                    
                  </>
                )}
              </>
            )}
            
            <s.SpacerLarge />
            <StyledLink target={"_blank"} href={null}>
                  Your Wallet: {
                  blockchain.account!=null? truncate(blockchain.account, 50):"Not Connected"}
              </StyledLink>
              <s.SpacerSmall/>
              <s.TextDescription
                style={{
                  textAlign: "center",
                  color: "var(--secondary)",
                  maxWidth: 600,
                  }}
                >REMEMBER: some of them are rarer than others. You will have a chance to own a rare or super rare Magic Pawn when Minting.
              </s.TextDescription>
              <s.SpacerSmall/>
              
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--accent-text:)",
            }}
          >
            Make sure you are connected to the right network ({CONFIG.NETWORK.NAME} Mainnet) and the correct address. 
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--accent-text:)",
            }}
          >
            I have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your Magic Pawn. I recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container>
      </s.Container>
      {setTimeout(() => {
      SET_COST( data.totalSupply <= 100 ? 0 : data.totalSupply <= 200 ? CONFIG.WEI_COST1:data.totalSupply <= 500 ? CONFIG.WEI_COST2:data.totalSupply <= 1000 ? CONFIG.WEI_COST3:data.totalSupply <= 2000 ? CONFIG.WEI_COST4: data.totalSupply <= 5555 ? CONFIG.WEI_COST5: '?' );
      }, 500)}
    </s.Screen>
    
  );
}

export default App;
