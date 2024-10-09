import { ID, Query } from 'appwrite';
import { appwriteConfig, account, avatars, storage, databases } from './config';

// ------------------------------
// AUTH
// ------------------------------

// -------------- SIGN UP ------------------ 
export async function createUserAccount(user) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarURL = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageURL: avatarURL,
    });

    return newUser;
  } catch (error) {
    console.log(error)
    return error;
  }
}

// -------------- SAVE USER TO DB ------------------ 
export async function saveUserToDB(user) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// -------------- SIGN IN ------------------ 
export async function signInAccount({ email, password }) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

// -------------- GET ACCOUNT ------------------ 
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

// -------------- LOGOUT ------------------ 
export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    console.log(error);
  }
}

// ------------------------------
// POSTS CRUD
// ------------------------------

// -------------- CREATE POST ------------------ 
export async function createPost(post) {
  try {
    //Upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    //Get file Url
    const fileURL = getFilePreview(uploadedFile.$id);

    if (!fileURL) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    //Conert tags in an array
    const tags = post.tags?.replace(/ /g, '').split(',') || [];

    //Save post to database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageURL: fileURL,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      console.log('entered deletion')
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// -------------- EDIT POST ------------------ 
export async function updatePost(post) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageURL: post.imageURL,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      //Upload image to storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      //Get file Url
      const fileURL = getFilePreview(uploadedFile.$id);
      if (!fileURL) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageURL: fileURL, imageId: uploadedFile.$id };

      // console.log(fileURL);
    }

    //Conert tags in an array
    const tags = post.tags?.replace(/ /g, '').split(',') || [];

    //Save post to database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageURL: image.imageURL,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// -------------- DELETE POST ------------------ 
export async function deletePost(postId, imageId) {
  if(!postId || !imageId) throw Error;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    if(!statusCode) throw Error

    await deleteFile(imageId)

    return {status: 'ok'}
  } catch (error) {
    console.log(error)
  }
  
}

// -------------- STORE MEDIA TO STORAGE------------------ 
export async function uploadFile(file) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// -------------- GET MEDIA URL------------------ 
export function getFilePreview(fileId){
  try {
    const fileURL = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    );

    if (!fileURL) throw Error;

    return fileURL;
  } catch (error) {
    console.log(error)
  }
}

// -------------- DELETE MEDIA FROM STORAGE------------------ 
export async function deleteFile(fileId){
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: 'ok'}
  } catch (error) {
    console.log(error)
  }
}

// ------------------------------
// POST RELATED FUNCTION
// ------------------------------

// -------------- LIKE/DISLIKE POST------------------ 
export async function likePost(postId, likesArray){
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if(!updatedPost) throw Error

    return updatedPost;
  } catch (error) {
    console.log(error)
  }
}

// -------------- SAVE POST------------------ 
export async function savePost(postId, userId) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// -------------- UNSAVE POST------------------ 
export async function deleteSavedPost(savedRecordId) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return {status: 'ok'};
  } catch (error) {
    console.log(error);
  }
}

// ------------------------------
// GET POSTS
// ------------------------------

// -------------- GET RECENT POSTS(HOME) LATEST CREATED------------------ 
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(20))]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// -------------- GET POST BY ID------------------ 
export async function getPostById(postId){
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    if (!post) throw Error;

    return post
  } catch (error) {
    console.log(error)
  }
}

// -------------- GET INFINITE POSTS(EXPLORE)------------------ 
export async function getInfinitePosts({pageParam}){
  const queries = [Query.orderDesc('$updatedAt'), Query.limit(10)]

  if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )

    if(!posts) throw Error;

    return posts;
    
  } catch (error) {
    console.log(error)
  }
}

// -------------- GET SEARCH POSTS BY CAPTION(EXPLORE)------------------ 
export async function searchPosts(searchTerm) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}


// ------------------------------
// USERS
// ------------------------------


export async function getUsers(limit){
  const queries = [Query.orderDesc("$createdAt")];

  if(limit){
    queries.push(Query.limit(limit));
  }

  try {
    const users = await  databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    )

    if(!users) throw Error

    return users;

  }catch(error){
    console.log(error)
  }
}