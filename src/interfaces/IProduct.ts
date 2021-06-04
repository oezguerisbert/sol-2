export default interface IProduct {
  popular?: boolean;
  title: string;
  link: string;
  benefits: {
    [key: string]: {
      prefix?: string;
      suffix?: string;
      value: any;
    };
  };
  color?: string;
  closure?: string;
  price: {
    an: number;
    mo: number;
  };
}
