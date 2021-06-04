export default interface IBlog {
  title: string;
  category: string;
  date: number;
  content: {
    short: string;
    full: string;
  };
  link: string;
}
