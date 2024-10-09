import { Loader, PostCard, UserCard } from '@/components/shared';
import { useGetRecentPost, useGetUsers } from '@/utilities/react-query/queries';

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPost();

  const {
    data: creators,
    isPending: isUserLoading,
    isError: isErrorCreator,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreator) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img
              src="/assets/icons/home.svg"
              width={36}
              height={36}
              alt="people"
              className="invert-white"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          </div>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post) => (
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
