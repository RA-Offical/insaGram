import { INewUser, IUpdatePost } from "@/types";
import { useQueryClient, useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
	createPost,
	createUserAccount,
	deletePost,
	deleteSavedPost,
	getCurrentUser,
	getInfinitePosts,
	getPostById,
	getRecentPosts,
	getSearchPosts,
	getUserById,
	getUsers,
	likePost,
	savePost,
	signInAccount,
	signOutAccount,
	updatePost,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

export function useCreateUserAccount() {
	return useMutation({
		mutationFn: (user: INewUser) => createUserAccount(user),
	});
}

export function useSignInAccount() {
	return useMutation({
		mutationFn: (user: { email: string; password: string }) => signInAccount(user),
	});
}

export function useSignOutAccount() {
	return useMutation({
		mutationFn: signOutAccount,
	});
}

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPost,
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			}),
	});
}

export function useGetRecentPosts() {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
		queryFn: getRecentPosts,
	});
}

export function useLikePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => {
			return likePost(postId, likesArray);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
}

export function useSavePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, userId }: { postId: string; userId: string }) => {
			return savePost(postId, userId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
}

export function useDeleteSavedPost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (savedRecordId: string) => {
			return deleteSavedPost(savedRecordId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
}

export function useGetCurrentUser() {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CURRENT_USER],
		queryFn: getCurrentUser,
	});
}

export function useGetPostById(postId: string) {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
		queryFn: () => getPostById(postId),
		enabled: !!postId,
	});
}

export function useUpdatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (post: IUpdatePost) => updatePost(post),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});
		},
	});
}

export function useDeletePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
			deletePost(postId, imageId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
}

export function useGetInfinitePosts() {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
		queryFn: getInfinitePosts,
		getNextPageParam: (lastPage) => {
			if (lastPage && lastPage.documents.length === 0) return null;
			const lastPageId = lastPage?.documents[lastPage?.documents?.length - 1]?.$id;
			return lastPageId;
		},
	});
}

export function useSearchPost(searchTerm: string) {
	return useQuery({
		queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
		queryFn: () => getSearchPosts(searchTerm),
		enabled: !!searchTerm,
	});
}

export function useGetUsers(limit?: number) {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USERS],
		queryFn: () => getUsers(limit),
	});
}

export function useGetUserById(userId: string) {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
		queryFn: () => getUserById(userId),
		enabled: !!userId,
	});
}
