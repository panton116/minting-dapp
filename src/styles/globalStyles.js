import styled from "styled-components";

export const Link = styled.link`

`;
export const Hr = styled.hr`
  width: 100%;
  margin: 25px;
  border: none;
  border-top: 1px solid #ffdd63;
`;
export const StyledButton = styled.button`
  border-radius: 3px;
  border: 1px solid #fff678;
  background-color:#a2310f;
  padding: 10px 20px 10px 20px;
  font-weight: 500;
  color: #fff678;
  cursor: pointer;


`;
export const StyledLink = styled.a`
  color: #ffc660;
  font-family: 'Zen Kaku Gothic Antique', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
`;
// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--primary);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  
`;

export const TextTitle = styled.p`
  color: #ffc660;
  font-family: 'Cinzel', Times, serif;
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
  
`;
export const TextTitle2 = styled.p`
  color: #ffc660;
  font-family: 'Zen Kaku Gothic Antique', sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.6;
`;

export const TextSubTitle = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const TextDescription = styled.p`
  color: #eb6217;
  font-family: 'Zen Kaku Gothic Antique', sans-serif;
  font-size: 14px;
  line-height: 1.3;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;
