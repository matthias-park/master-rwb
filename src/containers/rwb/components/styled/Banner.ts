import styled from 'styled-components';

export const FullBanner = styled.div`
  position: relative;
  .swiper-container {
    padding: 0px 148px;
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    img {
      height: 45vh;
      border-radius: 8px;
    }

    @media only screen and (max-width: 768px) {
      img {
        width: 0vw;
        height: 30vh;
      }
      &-active {
        img {
          width: 90vw;
        }
      }
    }

    @media only screen and (min-width: 769px) and (max-width: 922px) {
      img {
        width: 50vw;
      }
      &-active {
        img {
          width: 60vw;
        }
      }
    }

    @media only screen and (min-width: 923px) and (max-width: 1200px) {
      img {
        width: 65vw;
      }
      &-active {
        img {
          width: 60vw;
        }
      }
    }

    @media only screen and (min-width: 1201px) and (max-width: 1366px) {
      img {
        width: 75vw;
      }
      &-active {
        img {
          width: 68vw;
        }
      }
    }
    @media only screen and (min-width: 1367px) and (max-width: 1460px) {
      img {
        width: 75vw;
      }
      &-active {
        img {
          width: 73vw;
        }
      }
    }
    @media only screen and (min-width: 1461px) and (max-width: 1600px) {
      img {
        width: 75vw;
      }
      &-active {
        img {
          width: 75vw;
        }
      }
    }
    @media only screen and (min-width: 1601px) and (max-width: 1920px) {
      img {
        width: 80vw;
      }
      &-active {
        img {
          width: 76vw;
        }
      }
    }
    @media only screen and (min-width: 1921px) {
      img {
        width: 50vw;
      }
      &-active {
        img {
          width: 74vw;
        }
      }
    }
  }
  .swiper-navigation {
    .swiper-button-prev,
    .swiper-button-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 22.75px;
      opacity: 1;
      z-index: 2;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 35px;
      background-color: ${props => props.theme.buttons.primary?.color};
      font-size: 22.75px;
      padding: 7px 12px;
      &.disabled {
        display: none;
      }
      &:hover {
        opacity: 1;
      }
    }

    @media only screen and (max-width: 768px) {
      .swiper-button-prev,
      .swiper-button-next {
        display: none;
      }
    }

    @media only screen and (min-width: 769px) and (max-width: 922px) {
      .swiper-button-prev {
        left: 14%;
      }
      .swiper-button-next {
        right: 14%;
      }
    }

    @media only screen and (min-width: 923px) and (max-width: 1200px) {
      .swiper-button-prev {
        left: 15%;
      }
      .swiper-button-next {
        right: 15%;
      }
    }

    @media only screen and (min-width: 1201px) and (max-width: 1366px) {
      .swiper-button-prev {
        left: 12.5%;
      }
      .swiper-button-next {
        right: 12.5%;
      }
    }

    @media only screen and (min-width: 1367px) and (max-width: 1460px) {
      .swiper-button-prev {
        left: 10%;
      }
      .swiper-button-next {
        right: 10%;
      }
    }

    @media only screen and (min-width: 1461px) and (max-width: 1920px) {
      .swiper-button-prev {
        left: 9.5%;
      }
      .swiper-button-next {
        right: 9.5%;
      }
    }

    @media only screen and (min-width: 1921px) {
      .swiper-button-prev {
        left: 0.5%;
      }
      .swiper-button-next {
        right: 0.5%;
      }
    }
  }
  .swiper-pagination {
    position: absolute;
    display: flex;
    left: 50%;
    top: 101%;
    transform: translateX(-50%) translateY(-100%);
    z-index: 2;
    gap: 10px;
    background-color: ${props => props.theme.buttons.primary?.color};
    border-radius: 123px;
    padding: 8px 10px;
  }
  .swiper-pagination-bullet {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #d0d5df;
    &-active {
      background-color: ${props => props.theme.colors.primary.main};
    }
  }
`;
