import axios from 'axios'

const state = () => ({
  postList: [],
  profilePostList: [],
  post: {},
  profile: {},
  searchPosts: [],
  searchProfiles: {},
  trends: [],
  trendPosts: [],
  postImages: [],
  canSendFriendshipRequest: true,
})

const mutations = {
  clearPostData(state) {
    state.postList = []
    state.profilePostList = []
    state.post = {}
    state.profile = {}
    state.searchPosts = []
    state.searchProfiles = {}
    state.trends = []
    state.trendPosts = []
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
    const { searchPosts, searchProfiles } = searchData
    state.searchPosts = searchPosts
    state.searchProfiles = searchProfiles
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
}

const actions = {
  async getFeed({ commit }) {
    try {
      const response = await axios.get('/api/social-posts/')
      commit('setPostList', response.data.posts)
    } catch (error) {
      console.log('error', error)
    }
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
      const response = await axios.get(`/api/social-posts/${postId}/`)
      commit('setPostData', response.data.post)
    } catch (error) {
      console.log('error', error)
    }
  },
  async getProfilePostList({ commit }, profileSlug) {
    try {
      const response = await axios.get(
        `/api/social-posts/profile/${profileSlug}/`
      )
      commit('setProfilePostList', response.data.posts)
      commit('setProfile', response.data.profile)
      commit(
        'setCanSendFriendshipRequest',
        response.data.can_send_friendship_request
      )
    } catch (error) {
      console.log('error', error)
    }
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
      const response = await axios.post('/api/social-posts/search/', {
        query: query,
      })
      const payload = {
        searchPosts: response.data.posts,
        searchProfiles: response.data.profiles,
      }
      commit('setSearchData', payload)
    } catch (error) {
      console.log('error', error)
    }
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
      commit('setTrendPosts', response.data.posts)
    } catch (error) {
      console.log('error', error)
    }
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
