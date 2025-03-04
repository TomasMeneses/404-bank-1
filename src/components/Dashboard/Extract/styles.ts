import styled from 'styled-components'

export const CardContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 1rem;
  justify-self: center;
  justify-content: center;
  color: #3f3f3f;
  line-height: 1.7rem;
  font-family: 'Concert One', cursive;
`

export const CardDashboard = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 15%) 1.95px 1.95px 2.6px;
  height: 300px;
  overflow-y: scroll;
  animation: 0.8s ease 0s 1 normal forwards showCards;

    .title {
        display: flex;
        margin: 0.25rem 0 1rem 0;
        p {
            margin: 0.5rem 0 0 0.75rem;
        }
        img {
            margin-left: 0.5rem;
        }
    }
    p {
        margin-left: 0.75em;
    }
    h3 {
        margin-left: 0.75em;
    }

    .title-container {
        display: flex;
        margin: 0.5rem 0 1rem 0;
        p {
            margin-top: 0.3rem;
        }
    }
    .receipts {
        flex: 1;
        text-align: center;
        justify-content: space-between;
        padding: 0.5rem 0;
        display: flex;
        margin-bottom: 1rem;
        border-bottom: 1px solid #c3c3c3;
        div {
            .negative {
                color: red;
            }
            .positive {
                color: green;
            }
        }
    }
    @media only screen and (min-width: 768px) {
        .receipts {
            padding: 0 2rem;
            justify-content: space-between;
        }
    }

     /* Animation Show cards */
  @keyframes showCards{
    0% {
      opacity: 0.2;
      }
    100% {
      opacity: 1;
    }
  }
`
