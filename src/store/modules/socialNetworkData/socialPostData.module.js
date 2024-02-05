import axios from 'axios'

const state = () => ({
  postList: [],
  friendsPostList: [],
  profilePostList: [],
  post: {},
  profile: {},
})

const mutations = {
  setPostList(state, postList) {
    state.postList = postList
  },
  setPostToAllList(state, post) {
    state.profilePostList.unshift(post)
    state.postList.unshift(post)
    state.friendsPostList.unshift(post)
  },
  setFriendsPostList(state, friendsPostList) {
    state.friendsPostList = friendsPostList
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
}

const actions = {
  async getFeed({ commit }) {
    try {
      const response = await axios.get('/api/social-posts/')
      commit('setPostList', response.data.posts)
      commit('setFriendsPostList', response.data.friends_posts)
    } catch (error) {
      console.log('error', error)
    }
  },
  async submitPostForm({ commit }, post) {
    try {
      const response = await axios.post('/api/social-posts/create/', {
        body: post,
      })
      commit('setPostToAllList', response.data)
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
}

const getters = {
  postList: (state) => state.postList,
  friendsPostList: (state) => state.friendsPostList,
  profilePostList: (state) => state.profilePostList,
  post: (state) => state.post,
  profile: (state) => state.profile,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
