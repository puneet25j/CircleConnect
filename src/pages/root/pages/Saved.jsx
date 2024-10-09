import { GridPostList, Loader } from '@/components/shared';
import { useGetCurrentUser } from '@/utilities/react-query/queries';

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  if(currentUser){
    console.log(currentUser)
  }

  const savePosts = currentUser?.save
    .map((savePost) => ({
      ...savePost.post,
      // creator: {
      //   imageURL: currentUser.imageURL,
      // },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>
      {!currentUser ? (<Loader/>) : (
        <ul className='w-full flex justify-center max-w-5xl gap-9'>
          {savePosts.length === 0 ? (
            <p className='text-light-4'>No available posts</p>
          ): (
            <GridPostList posts={savePosts} showStats={false} showUser={false}/>
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
