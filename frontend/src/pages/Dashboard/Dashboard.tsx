import { useAppSelector } from '../../store/store';

export default function Dashboard() {
  const organizations = useAppSelector((store) => store.userSlice.organization);

  return <>{JSON.stringify(organizations)}</>;
}
