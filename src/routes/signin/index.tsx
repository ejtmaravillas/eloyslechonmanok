import { component$ } from '@builder.io/qwik';
import { useAuthSession } from '~/routes/plugin@auth';

export default component$(() => {
  const session = useAuthSession();
  return <p>{session.value?.user?.email}</p>;
});