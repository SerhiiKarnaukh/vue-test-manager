import axios from 'axios'

const state = () => ({
  postList: [],
  profilePostList: [],
  post: {},
  profile: {},
  searchPosts: [],
  searchProfiles: {},
  searchQuery: null,
  trends: [],
  trendPosts: [],
  postImages: [],
  canSendFriendshipRequest: true,
  postsNextPage: null,
  profilePostListNextPage: null,
  searchNextPage: null,
  trendNextPage: null,
})

const mutations = {
  clearPostData(state) {
    state.postList = []
    state.profilePostList = []
    state.post = {}
    state.profile = {}
    state.searchPosts = []
    state.searchProfiles = {}
    state.searchQuery = null
    state.trends = []
    state.trendPosts = []
    state.postsNextPage = null
    state.profilePostListNextPage = null
    state.searchNextPage = null
    state.trendNextPage = null
  },
  setPostList(state, postList) {
    state.postList = postList
  },
  setPostToAllList(state, post) {
    state.profilePostList.unshift(post)
    state.postList.unshift(post)
  },
  setProfilePostList(state, profilePostList) {
    state.profilePostList = profilePostList
  },
  setPostData(state, post) {
    state.post = post
  },
  setProfile(state, profile) {
    state.profile = profile
  },
  setSearchData(state, searchData) {
    const { searchPosts, searchProfiles, searchQuery } = searchData
    state.searchPosts = searchPosts
    state.searchProfiles = searchProfiles
    state.searchQuery = searchQuery
  },
  setTrends(state, trends) {
    state.trends = trends
  },
  setTrendPosts(state, posts) {
    state.trendPosts = posts
  },
  uploadSelectedPostImages(state, images) {
    if (images.length != 0) {
      state.postImages.push(...images)
    } else {
      state.postImages = images
    }
  },
  setCanSendFriendshipRequest(state, data) {
    state.canSendFriendshipRequest = data
  },
  removePostFromAllList(state, postId) {
    state.profilePostList = state.profilePostList.filter(
      (post) => post.id !== postId
    )
    state.postList = state.postList.filter((post) => post.id !== postId)
  },
  setPostsNextPage(state, value) {
    state.postsNextPage = value
  },
  setProfilePostListNextPage(state, value) {
    state.profilePostListNextPage = value
  },
  setSearchNextPage(state, value) {
    state.searchNextPage = value
  },
  setTrendNextPage(state, value) {
    state.trendNextPage = value
  },
}

const actions = {
  async getFeed({ commit }) {
    try {
      const response = await axios.get('/api/social-posts/')
      commit('setPostList', response.data.results.posts)
      commit('setPostsNextPage', response.data.next)
    } catch (error) {
      console.log('error', error)
    }
  },
  async fetchNextPageOfPosts({ commit, state }, url) {
    const URLobj = new URL(url)
    await axios.get(URLobj.pathname + URLobj.search).then(async (response) => {
      const posts = [...state.postList, ...response.data.results.posts]
      commit('setPostList', posts)
      commit('setPostsNextPage', response.data.next)
    })
  },
  async submitPostForm({ state, commit }, formData) {
    if (state.postImages) {
      state.postImages.forEach((object, index) => {
        formData.append(`images[${index}]`, object.file)
      })
    }
    try {
      const response = await axios.post('/api/social-posts/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      commit('setPostToAllList', response.data)
      state.profile.posts_count += 1
    } catch (error) {
      console.log('error', error)
    }
  },
  async getPostData({ commit }, postId) {
    try {
      commit('setPostData', {})
      const response = await axios.get(`/api/social-posts/${postId}/`)
      commit('setPostData', response.data.post)
    } catch (error) {
      console.log('error', error)
    }
  },
  async getProfilePostList({ commit }, profileSlug) {
    try {
      commit('setProfile', {})
      const response = await axios.get(
        `/api/social-posts/profile/${profileSlug}/`
      )
      commit('setProfilePostList', response.data.results.posts)
      commit('setProfile', response.data.results.profile)
      commit(
        'setCanSendFriendshipRequest',
        response.data.results.can_send_friendship_request
      )
      commit('setProfilePostListNextPage', response.data.next)
    } catch (error) {
      console.log('error', error)
    }
  },
  async fetchNextPageOfProfilePostList({ commit, state }, url) {
    const URLobj = new URL(url)
    await axios.get(URLobj.pathname + URLobj.search).then(async (response) => {
      const posts = [...state.profilePostList, ...response.data.results.posts]
      commit('setProfilePostList', posts)
      commit('setProfilePostListNextPage', response.data.next)
    })
  },
  async submitPostCommentForm({ state }, payload) {
    const { postId, commentBody } = payload
    try {
      const response = await axios.post(
        `/api/social-posts/${postId}/comment/`,
        {
          body: commentBody,
        }
      )
      state.post.comments.push(response.data)
      state.post.comments_count += 1
    } catch (error) {
      console.log('error', error)
    }
  },
  async search({ commit }, query) {
    try {
      const response = await axios.post('/api/social-posts/search/', { query })
      const payload = {
        searchPosts: response.data.results.posts,
        searchProfiles: response.data.results.profiles,
        searchQuery: query,
      }
      commit('setSearchData', payload)
      commit('setSearchNextPage', response.data.next)
    } catch (error) {
      console.log('error', error)
    }
  },
  async fetchNextPageOfSearch({ commit, state }, url) {
    const URLobj = new URL(url)
    const params = new URLSearchParams(URLobj.search)
    params.set('query', state.searchQuery)

    await axios
      .get(`${URLobj.pathname}?${params.toString()}`)
      .then(async (response) => {
        const posts = [...state.searchPosts, ...response.data.results.posts]
        const payload = {
          searchPosts: posts,
          searchProfiles: response.data.results.profiles,
          searchQuery: state.searchQuery,
        }
        commit('setSearchData', payload)
        commit('setSearchNextPage', response.data.next)
      })
  },
  async getTrends({ commit }) {
    try {
      const response = await axios.get('/api/social-posts/trends/')
      commit('setTrends', response.data)
    } catch (error) {
      console.log('error', error)
    }
  },
  async getTrendPosts({ commit }, trendId) {
    try {
      const response = await axios.get(`/api/social-posts/?trend=${trendId}`)
      commit('setTrendPosts', response.data.results.posts)
      commit('setTrendNextPage', response.data.next)
    } catch (error) {
      console.log('error', error)
    }
  },
  async fetchNextPageOfTrend({ commit, state }, url) {
    const URLobj = new URL(url)
    await axios.get(URLobj.pathname + URLobj.search).then(async (response) => {
      const posts = [...state.trendPosts, ...response.data.results.posts]
      commit('setTrendPosts', posts)
      commit('setTrendNextPage', response.data.next)
    })
  },
  async reportPost({ dispatch }, postId) {
    try {
      await axios.post(`/api/social-posts/${postId}/report/`)
      await dispatch(
        'alert/setMessage',
        {
          value: ['The post was reported'],
          type: 'success',
        },
        { root: true }
      )
    } catch (error) {
      console.log('error', error)
    }
  },
  async deletePost({ state, commit, dispatch }, postId) {
    try {
      commit('removePostFromAllList', postId)
      state.profile.posts_count -= 1
      await axios.delete(`/api/social-posts/${postId}/delete/`)
      await dispatch(
        'alert/setMessage',
        {
          value: ['The post was deleted'],
          type: 'success',
        },
        { root: true }
      )
    } catch (error) {
      console.log('error', error)
    }
  },
}

const getters = {
  postList: (state) => state.postList,
  profilePostList: (state) => state.profilePostList,
  post: (state) => state.post,
  profile: (state) => state.profile,
  searchPosts: (state) => state.searchPosts,
  searchProfiles: (state) => state.searchProfiles,
  trends: (state) => state.trends,
  trendPosts: (state) => state.trendPosts,
  postImages: (state) => state.postImages,
  canSendFriendshipRequest: (state) => state.canSendFriendshipRequest,
  postsNextPage: (state) => state.postsNextPage,
  profilePostListNextPage: (state) => state.profilePostListNextPage,
  searchNextPage: (state) => state.searchNextPage,
  trendNextPage: (state) => state.trendNextPage,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
