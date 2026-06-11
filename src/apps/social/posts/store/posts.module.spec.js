import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as actionsApi from '../api/actions'
import * as feedApi from '../api/feed'
import * as postsApi from '../api/posts'
import * as searchApi from '../api/search'
import * as trendsApi from '../api/trends'
import postsModule from './posts.module'

vi.mock('../api/feed', () => ({
  fetchFeed: vi.fn(),
  fetchPaginated: vi.fn(),
  fetchProfilePosts: vi.fn(),
  fetchTrendPosts: vi.fn(),
}))

vi.mock('../api/posts', () => ({
  fetchPost: vi.fn(),
  createPost: vi.fn(),
  addComment: vi.fn(),
}))

vi.mock('../api/search', () => ({
  searchPosts: vi.fn(),
  fetchSearchPage: vi.fn(),
}))

vi.mock('../api/trends', () => ({
  fetchTrends: vi.fn(),
}))

vi.mock('../api/actions', () => ({
  likePost: vi.fn(),
  reportPost: vi.fn(),
  deletePost: vi.fn(),
}))

describe('social posts module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getFeed commits posts and next page', async () => {
    const commit = vi.fn()
    feedApi.fetchFeed.mockResolvedValueOnce({
      data: { results: { posts: [{ id: 1 }] }, next: '/api/social-posts/?page=2' },
    })

    await postsModule.actions.getFeed({ commit })

    expect(commit).toHaveBeenCalledWith('setPostList', [{ id: 1 }])
    expect(commit).toHaveBeenCalledWith('setPostsNextPage', '/api/social-posts/?page=2')
  })

  it('fetchNextPageOfPosts appends posts', async () => {
    const commit = vi.fn()
    const state = { postList: [{ id: 1 }] }
    feedApi.fetchPaginated.mockResolvedValueOnce({
      data: { results: { posts: [{ id: 2 }] }, next: null },
    })

    await postsModule.actions.fetchNextPageOfPosts(
      { commit, state },
      'http://localhost/api/social-posts/?page=2'
    )

    expect(commit).toHaveBeenCalledWith('setPostList', [{ id: 1 }, { id: 2 }])
  })

  it('getPostData commits post payload', async () => {
    const commit = vi.fn()
    postsApi.fetchPost.mockResolvedValueOnce({ data: { post: { id: 3 } } })

    await postsModule.actions.getPostData({ commit }, 3)

    expect(commit).toHaveBeenCalledWith('setPostData', {})
    expect(commit).toHaveBeenCalledWith('setPostData', { id: 3 })
  })

  it('getProfilePostList commits profile posts', async () => {
    const commit = vi.fn()
    feedApi.fetchProfilePosts.mockResolvedValueOnce({
      data: {
        results: {
          posts: [{ id: 4 }],
          profile: { slug: 'john' },
          can_send_friendship_request: false,
        },
        next: null,
      },
    })

    await postsModule.actions.getProfilePostList({ commit }, 'john')

    expect(commit).toHaveBeenCalledWith('setProfilePostList', [{ id: 4 }])
    expect(commit).toHaveBeenCalledWith('setProfile', { slug: 'john' })
    expect(commit).toHaveBeenCalledWith('setCanSendFriendshipRequest', false)
  })

  it('submitPostCommentForm appends comment to post', async () => {
    const state = { post: { comments: [], comments_count: 0 } }
    postsApi.addComment.mockResolvedValueOnce({ data: { id: 10, body: 'hi' } })

    await postsModule.actions.submitPostCommentForm(
      { state },
      { postId: 5, commentBody: 'hi' }
    )

    expect(state.post.comments).toEqual([{ id: 10, body: 'hi' }])
    expect(state.post.comments_count).toBe(1)
  })

  it('search commits search payload', async () => {
    const commit = vi.fn()
    searchApi.searchPosts.mockResolvedValueOnce({
      data: {
        results: { posts: [{ id: 2 }], profiles: [{ id: 3 }] },
        next: null,
      },
    })

    await postsModule.actions.search({ commit }, 'vue')

    expect(commit).toHaveBeenCalledWith('setSearchData', {
      searchPosts: [{ id: 2 }],
      searchProfiles: [{ id: 3 }],
      searchQuery: 'vue',
    })
  })

  it('getTrends commits trends list', async () => {
    const commit = vi.fn()
    trendsApi.fetchTrends.mockResolvedValueOnce({ data: [{ id: 'vue' }] })

    await postsModule.actions.getTrends({ commit })

    expect(commit).toHaveBeenCalledWith('setTrends', [{ id: 'vue' }])
  })

  it('getTrendPosts commits trend feed', async () => {
    const commit = vi.fn()
    feedApi.fetchTrendPosts.mockResolvedValueOnce({
      data: { results: { posts: [{ id: 6 }] }, next: null },
    })

    await postsModule.actions.getTrendPosts({ commit }, 'vue')

    expect(commit).toHaveBeenCalledWith('setTrendPosts', [{ id: 6 }])
  })

  it('likePost delegates to api', async () => {
    actionsApi.likePost.mockResolvedValueOnce({ data: { message: 'like created' } })
    const response = await postsModule.actions.likePost({}, 5)
    expect(actionsApi.likePost).toHaveBeenCalledWith(5)
    expect(response.data.message).toBe('like created')
  })

  it('reportPost shows success alert', async () => {
    const dispatch = vi.fn()
    actionsApi.reportPost.mockResolvedValueOnce({})

    await postsModule.actions.reportPost({ dispatch }, 8)

    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['The post was reported'], type: 'success' },
      { root: true }
    )
  })

  it('deletePost removes post and shows alert', async () => {
    const commit = vi.fn()
    const dispatch = vi.fn()
    const state = {
      profile: { posts_count: 2 },
      postList: [{ id: 9 }],
      profilePostList: [{ id: 9 }],
    }
    actionsApi.deletePost.mockResolvedValueOnce({})

    await postsModule.actions.deletePost({ state, commit, dispatch }, 9)

    expect(commit).toHaveBeenCalledWith('removePostFromAllList', 9)
    expect(state.profile.posts_count).toBe(1)
    expect(dispatch).toHaveBeenCalledWith(
      'alert/setMessage',
      { value: ['The post was deleted'], type: 'success' },
      { root: true }
    )
  })

  it('uploadSelectedPostImages mutation handles empty and new images', () => {
    const state = postsModule.state()
    postsModule.mutations.uploadSelectedPostImages(state, [{ file: 'a' }])
    expect(state.postImages).toHaveLength(1)
    postsModule.mutations.uploadSelectedPostImages(state, [])
    expect(state.postImages).toEqual([])
  })

  it('submitPostForm creates post and updates profile count', async () => {
    const commit = vi.fn()
    const state = {
      postImages: [{ file: 'image-a' }],
      profile: { posts_count: 1 },
    }
    const formData = new FormData()
    postsApi.createPost.mockResolvedValueOnce({ data: { id: 11 } })

    await postsModule.actions.submitPostForm({ state, commit }, formData)

    expect(postsApi.createPost).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('setPostToAllList', { id: 11 })
    expect(state.profile.posts_count).toBe(2)
  })

  it('fetchNextPageOfSearch appends search results', async () => {
    const commit = vi.fn()
    const state = { searchPosts: [{ id: 1 }], searchQuery: 'vue' }
    searchApi.fetchSearchPage.mockResolvedValueOnce({
      data: {
        results: { posts: [{ id: 2 }], profiles: [{ id: 3 }] },
        next: null,
      },
    })

    await postsModule.actions.fetchNextPageOfSearch(
      { commit, state },
      'http://localhost/api/social-posts/search/?page=2&query=vue'
    )

    expect(commit).toHaveBeenCalledWith('setSearchData', {
      searchPosts: [{ id: 1 }, { id: 2 }],
      searchProfiles: [{ id: 3 }],
      searchQuery: 'vue',
    })
  })

  it('fetchNextPageOfTrend appends trend posts', async () => {
    const commit = vi.fn()
    const state = { trendPosts: [{ id: 1 }] }
    feedApi.fetchPaginated.mockResolvedValueOnce({
      data: { results: { posts: [{ id: 2 }] }, next: null },
    })

    await postsModule.actions.fetchNextPageOfTrend(
      { commit, state },
      'http://localhost/api/social-posts/?trend=vue&page=2'
    )

    expect(commit).toHaveBeenCalledWith('setTrendPosts', [{ id: 1 }, { id: 2 }])
  })

  it('fetchNextPageOfProfilePostList appends profile posts', async () => {
    const commit = vi.fn()
    const state = { profilePostList: [{ id: 1 }] }
    feedApi.fetchPaginated.mockResolvedValueOnce({
      data: { results: { posts: [{ id: 2 }] }, next: null },
    })

    await postsModule.actions.fetchNextPageOfProfilePostList(
      { commit, state },
      'http://localhost/api/social-posts/profile/john/?page=2'
    )

    expect(commit).toHaveBeenCalledWith('setProfilePostList', [{ id: 1 }, { id: 2 }])
  })

  it('getFeed logs errors without throwing', async () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    feedApi.fetchFeed.mockRejectedValueOnce(new Error('network'))

    await postsModule.actions.getFeed({ commit })

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).not.toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('clearPostData mutation resets state', () => {
    const state = postsModule.state()
    state.postList = [{ id: 1 }]
    state.trends = [{ id: 'x' }]
    postsModule.mutations.clearPostData(state)
    expect(state.postList).toEqual([])
    expect(state.trends).toEqual([])
  })

  it('exposes post getters', () => {
    const state = {
      postList: [{ id: 1 }],
      profilePostList: [{ id: 2 }],
      post: { id: 3 },
      profile: { slug: 'john' },
      searchPosts: [{ id: 4 }],
      searchProfiles: { results: [] },
      trends: [{ id: 'vue' }],
      trendPosts: [{ id: 5 }],
      postImages: [{ file: 'a' }],
      canSendFriendshipRequest: false,
      postsNextPage: '/next',
      profilePostListNextPage: '/profile-next',
      searchNextPage: '/search-next',
      trendNextPage: '/trend-next',
    }

    expect(postsModule.getters.postList(state)).toEqual([{ id: 1 }])
    expect(postsModule.getters.profilePostList(state)).toEqual([{ id: 2 }])
    expect(postsModule.getters.post(state)).toEqual({ id: 3 })
    expect(postsModule.getters.profile(state)).toEqual({ slug: 'john' })
    expect(postsModule.getters.searchPosts(state)).toEqual([{ id: 4 }])
    expect(postsModule.getters.searchProfiles(state)).toEqual({ results: [] })
    expect(postsModule.getters.trends(state)).toEqual([{ id: 'vue' }])
    expect(postsModule.getters.trendPosts(state)).toEqual([{ id: 5 }])
    expect(postsModule.getters.postImages(state)).toEqual([{ file: 'a' }])
    expect(postsModule.getters.canSendFriendshipRequest(state)).toBe(false)
    expect(postsModule.getters.postsNextPage(state)).toBe('/next')
    expect(postsModule.getters.profilePostListNextPage(state)).toBe('/profile-next')
    expect(postsModule.getters.searchNextPage(state)).toBe('/search-next')
    expect(postsModule.getters.trendNextPage(state)).toBe('/trend-next')
  })
})
