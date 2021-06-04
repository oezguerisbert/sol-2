export default interface IRoomProps {
  roomid: string;
  title: string;
  description: string;
  members: Array<any>;
  refetch: any;
  maxmembers: number;
}
