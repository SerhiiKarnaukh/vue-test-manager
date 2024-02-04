import axios from 'axios'

const state = () => ({
  postList: [],
  friendsPostList: [],
  post: {},
})

const mutations = {
  setPostList(state, postList) {
    state.postList = postList
  },
  setFriendsPostList(state, friendsPostList) {
    state.friendsPostList = friendsPostList
  },
  setPostData(state, post) {
    state.post = post
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
  async submitPostForm({ dispatch }, post) {
    try {
      await axios.post('/api/social-posts/create/', {
        body: post,
      })
      await dispatch('getFeed')
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
  post: (state) => state.post,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
