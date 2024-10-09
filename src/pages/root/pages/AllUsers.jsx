import { useToast } from '@/hooks/use-toast';
import { useGetUsers } from '@/utilities/react-query/queries';
import { Loader, UserCard } from '@/components/shared';

const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isPending, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    return toast({ title: 'Something went wrong.', variant: 'destructive' });
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="people"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        </div>
        {isPending && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
