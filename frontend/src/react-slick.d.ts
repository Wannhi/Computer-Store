declare module 'react-slick' {
  import * as React from 'react';

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    arrows?: boolean;
    centerMode?: boolean;
    centerPadding?: string;
    swipeToSlide?: boolean;
    focusOnSelect?: boolean;
    responsive?: {
      breakpoint: number;
      settings: Settings;
    }[];
    adaptiveHeight?: boolean;
    variableWidth?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
    beforeChange?: (current: number, next: number) => void;
    afterChange?: (current: number) => void;
    className?: string;
    asNavFor?: Slider;
    pauseOnHover?: boolean;
    children?: React.ReactNode;
  }

  export default class Slider extends React.Component<Settings> {
    slickGoTo: (slideNumber: number) => void;
    slickNext: () => void;
    slickPrev: () => void;
    slickPause: () => void;
    slickPlay: () => void;
  }
}
