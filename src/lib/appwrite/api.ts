import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
	try {
		const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(user.name);

		const newUser = await saveUserToDB({
			accountId: newAccount.$id,
			name: newAccount.name,
			email: newAccount.email,
			username: user.username,
			imageUrl: avatarUrl,
		});

		return newUser;
	} catch (error) {
		console.log(error);
		return error;
	}
}

async function saveUserToDB(user: {
	accountId: String;
	name: String;
	email: String;
	username?: String;
	imageUrl: URL;
}) {
	try {
		const newUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			ID.unique(),
			user
		);
		return newUser;
	} catch (error) {
		console.log(error);
	}
}

export async function signInAccount(user: { email: string; password: string }) {
	try {
		const session = await account.createEmailSession(user.email, user.password);
		return session;
	} catch (error) {
		console.log(error);
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await account.get();
		if (!currentAccount) throw new Error();

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.usersCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser) throw new Error();

		return currentUser.documents[0];
	} catch (error) {
		console.log(error);
		// return error;
	}
}

export async function signOutAccount() {
	try {
		const session = await account.deleteSession("current");
		return session;
	} catch (error) {
		console.log(error);
	}
}

export async function createPost(post: INewPost) {
	try {
		const uploadedFile = await uploadFile(post.file[0]);

		if (!uploadedFile) throw Error;

		// Get file url
		const fileUrl = getFilePreview(uploadedFile.$id);

		if (!fileUrl) {
			deleteFile(uploadedFile.$id);
			throw Error;
		}

		//convert tags in an array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

		console.log({
			creator: post.userId,
			caption: post.caption,
			tags: tags,
			imageUrl: fileUrl,
			imageId: uploadedFile.$id,
			location: post.location,
		});

		// save post to database
		const newPost = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			ID.unique(),
			{
				creator: post.userId,
				caption: post.caption,
				tags: tags,
				imageUrl: fileUrl,
				imageId: uploadedFile.$id,
				location: post.location,
			}
		);

		if (!newPost) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		return newPost;
	} catch (error) {
		console.log(error);
	}
}

async function uploadFile(file: File) {
	try {
		const uploadedFile = storage.createFile(appwriteConfig.storageId, ID.unique(), file);

		return uploadedFile;
	} catch (error) {
		console.log(error);
	}
}

export function getFilePreview(fileId: string) {
	try {
		const fileUrl = storage.getFilePreview(
			appwriteConfig.storageId,
			fileId,
			2000,
			2000,
			"top",
			100
		);

		return fileUrl;
	} catch (error) {
		console.log(error);
	}
}

async function deleteFile(fileId: string) {
	try {
		await storage.deleteFile(appwriteConfig.storageId, fileId);

		return { status: "ok" };
	} catch (error) {
		console.log(error);
	}
}

export async function getRecentPosts() {
	const posts = await databases.listDocuments(
		appwriteConfig.databaseId,
		appwriteConfig.postsCollectionId,
		[Query.orderDesc("$createdAt"), Query.limit(20)]
	);

	if (!posts) throw Error;

	return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
	try {
		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			postId,
			{
				likes: likesArray,
			}
		);

		if (!updatedPost) throw Error;

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function savePost(postId: string, userId: string) {
	try {
		const updatedPost = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.savesCollectionId,
			ID.unique(),
			{
				user: userId,
				post: postId,
			}
		);

		if (!updatedPost) throw Error;

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteSavedPost(savedRecordId: string) {
	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.savesCollectionId,
			savedRecordId
		);

		if (!statusCode) throw Error;

		return { status: "ok" };
	} catch (error) {
		console.log(error);
	}
}

export async function getPostById(postId: string) {
	try {
		const post = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			postId
		);

		return post;
	} catch (error) {
		console.log(error);
	}
}

export async function updatePost(post: IUpdatePost) {
	const hasFileToUpdate = post.file.length > 0;

	try {
		let image = { imageUrl: post.imageUrl, imageId: post.imageId };

		if (hasFileToUpdate) {
			// upload image to storage
			const uploadedFile = await uploadFile(post.file[0]);

			if (!uploadedFile) throw Error;

			//Get file url
			const fileUrl = getFilePreview(uploadedFile.$id);

			if (!fileUrl) {
				await deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
		}

		//convert tags to array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];
		//save post to database
		const updatedPost = databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,

			post.postId,
			{
				caption: post.caption,
				imageUrl: image.imageUrl,
				imageId: image.imageId,
				location: post.location,
				tags: tags,
			}
		);

		if (!updatedPost) {
			await deleteFile(post.imageId);
			throw Error;
		}
		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function deletePost(postId?: string, imageId?: string) {
	if (!postId || !imageId) throw Error;

	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postsCollectionId,
			postId
		);

		if (!statusCode) throw Error;

		await deleteFile(imageId);

		return { status: "Ok" };
	} catch (error) {
		console.log(error);
	}
}
