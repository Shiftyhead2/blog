import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import "firebase/auth";
import db from "../firebase/firebaseInit";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    blogPost: [],
    postLoaded : null,
    blogHTML: "Write your blog title...",
    blogTitle: "",
    blogPhotoName: "",
    blogPhotoFileURL: null,
    blogPhotoPreview:null,
    editPost: null,
    user:null,
    profileEmail:null,
    profileFirstName:null,
    profileLastName:null,
    profileUserName:null,
    profileId:null,
    profileInitials:null,
  },
  getters:{
    blogPostsFeed(state){
      return state.blogPost.slice(0,2);
    },
    blogPostsCards(state){
      return state.blogPost.slice(2,6);
    }
  },
  mutations: {
    newBlogPost(state,payload){
      state.blogHTML = payload;
    },
    updateBlogTitle(state,payload){
      state.blogTitle = payload;
    },
    fileNameChange(state,payload){
      state.blogPhotoName = payload;
    },
    createFileURL(state,payload){
      state.blogPhotoFileURL = payload;
    },
    toggleEditPost(state,payload){
      state.editPost = payload;
    },
    filterBlogPost(state,payload){
      state.blogPost = state.blogPost.filter((post) => post.blogID !== payload)  
    },
    updateUser(state,payload){
      state.user = payload;
    },
    setProfileInfo(state,doc){
      state.profileId = doc.id;
      state.profileEmail = doc.data().email;
      state.profileFirstName = doc.data().firstName;
      state.profileLastName = doc.data().lastName;
      state.profileUserName = doc.data().username;
    },
    setProfileInitials(state){
      state.profileInitials = state.profileFirstName.match(/(\b\S)?/g).join("") + state.profileLastName.match(/(\b\S)?/g).join("");
    },
    changeFirstName(state,payload){
      state.profileFirstName = payload;
    },
    changeLastName(state,payload){
      state.profileLastName = payload;
    },
    changeUserName(state,payload){
      state.profileUserName = payload;
    },
    openPhotoPreview(state){
      state.blogPhotoPreview = !state.blogPhotoPreview;
    },
    setBlogState(state,payload){
      state.blogTitle = payload.blogTitle;
      state.blogHTML = payload.blogHTML;
      state.blogPhotoFileURL = payload.blogCoverPhoto;
      state.blogPhotoName = payload.blogCoverPhotoName;
    },
  },
  actions: {
    async getCurrentUser({commit}) {
      const dataBase = await db.collection('users').doc(firebase.auth().currentUser.uid);
      const dbResults = await dataBase.get();
      commit("setProfileInfo",dbResults);
      commit("setProfileInitials");
    },
    async GetPost({state}){
      const dataBase = await db.collection('blogPosts').orderBy('date','desc');
      const dbResults = await dataBase.get();
      dbResults.forEach((doc) => {
        if(!state.blogPost.some(post => post.blogID === doc.id)){
          const data = {
            blogID: doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
            blogCoverPhotoName: doc.data().blogCoverPhotoName,
          }

          state.blogPost.push(data);

        }
      });
      state.postLoaded = true;
    },
    async updatePost({commit,dispatch},payload){
      commit('filterBlogPost',payload);
      await dispatch('GetPost');
    },
    async deletePost({commit},payload){
      const getPost = await db.collection('blogPosts').doc(payload);
      await getPost.delete();
      commit('filterBlogPost',payload)
    },
    async updateUserSettings({commit,state}){
      const dataBase = await db.collection('users').doc(state.profileId);
      await dataBase.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username:state.profileUserName,
      });
      commit("setProfileInitials");
    }
  },
  modules: {
  }
})
