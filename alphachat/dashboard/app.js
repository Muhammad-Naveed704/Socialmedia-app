
import { 
    auth,
    app,
    db,
    doc,
    getDoc,
    onAuthStateChanged,
    signOut,
    getDocs,
    collection,
    addDoc, } from "../firebaseConfig.js";
  
  
  const logout = document.getElementById('logout');
  const photoIcon = document.getElementById('photoIcon');
  const postBtn = document.getElementById('postBtn');
  const textPost = document.getElementById('textPost');
  const ContentBox = document.getElementById('ContentBox');
  
  // userdetail
  const userName = document.querySelector('.userName');
  const displayImage = document.querySelector('#displayImage');
  let uploadedImage = "";
  const image_input = document.getElementById('image_input');
  const userinfo = document.getElementById("userinfo");
  
  let currentActiveUser;
  onAuthStateChanged(auth, (activeUser) => {
    if (activeUser) {
        // User is signed in, see docs for a list of available properties
      
        const uid = activeUser.uid;
        // console.log(uid)
        getUserData(uid)
        currentActiveUser = uid
    } else {
        // User is signed out
        // console.log("sign out")
        window.location.href = '../index.html'
    }
  });
  
  
  
  async function getUserData(uid){
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await  getDoc(docRef);
  
  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    const {firstName,lastName,email} = docSnap.data();
    // console.log(time)
    userinfo.innerHTML = ` <img class="userImg" src="../Assets/profile pic.jfif" alt="">
    <h5 class="userDetailName m-1">${firstName} ${lastName}</h5>
    <button type="button" class="profileBtn container rounded-0" data-bs-dismiss="modal" id="signupBtn">Profile</button>
    <p class="userEmail m-1">${email}</p>
    <p class="userDetail">Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia quia ab velit non commodi unde odit,</p>
  </div>`
  
  userName.innerHTML = `${firstName}${lastName}`;
  
  
  
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
    } catch (error) {
      console.log(error, "error is get in data")
    }
  };
  
  // fileupload
  photoIcon.addEventListener('click', fileOpenHandler)
  function fileOpenHandler(){
      image_input.click();
  }
  
  // logout function
  
  logout.addEventListener('click',logoutHandler)
  
  function logoutHandler(){
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("signout successfully")
      location.href = "../index.html";
  
  }).catch((error) => {
      // An error happened.
      console.log(error);
  });
  
  }
  
  // for post function
  // userName.innerHTML = `${firstName} ${lastName}`;
  
  postBtn.addEventListener('click', async () => {
    // console.log("ggdf");
    // console.log(currentActiveUser);
  
    image_input.addEventListener("change",function (){
      console.log(image_input.value);
      const reader = new FileReader();
      console.log(reader);
      reader.addEventListener("load", ()=> {
        uploadedImage = reader.result;
        console.log(uploadedImage);
        displayImage.style.backgroundImage = `url(${uploadedImage})`
      });
      reader.readAsDataURL(this.files[0]);
    })
  
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        postPersonId: currentActiveUser,
        postData: textPost.value,
      });
      console.log("Document written with ID: ", docRef.id);
      getPost()
    } catch (e) {
      console.error("Error adding document: ", e);
    };
  });
  
  
  async function getPost(){
    
    const querySnapshot = await getDocs(collection(db, "posts"));
  querySnapshot.forEach(async(doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    const {postData,postPersonId,url} = doc.data()
    console.log(url)
    
    const activeAuthrDetail = await getPostUserData(postPersonId)
    console.log(activeAuthrDetail);
    
    // ContentBox.innerHTML = "";
    
  let div = document.createElement('div');
    div.setAttribute('class', 'postArea mb-3' )
  
    div.innerHTML = `
    <div class="postContent container-fluid py-2 rounded-2 d-flex direction-column">
    <img class="userImg" src="../Assets/profile pic.jfif" alt="">
    <p class="userName mt-2">${activeAuthrDetail?.firstName}${activeAuthrDetail?.lastName}</p>
    <p id="postTime">2 minutes</p>
    <p class="postText mt-2">${postData}</p>
  </div>
  <div class="postImage mt-4">
    ${url}
  </div>
    `
    ContentBox.prepend(div)
    textPost.value = ''
    
  });
  }
  
  async function getPostUserData(authUid){
    
  const docRef = doc(db, "users", authUid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data()
    // console.log(firstName,lastName)
    
  } else {
    
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  }
  // messanger shown display
  
  let messangerIcon = document.querySelector('.messageIcon')
  let meassangerBox = document.querySelector('.massangerBox');
  
  messangerIcon.addEventListener('click', messangerDisplayHandler);
  
  function messangerDisplayHandler(){
  
    meassangerBox.style.display = "block";
  }
  
  // messanger close display
  
  let btnClose = document.querySelector('.closeBtn');
  
  btnClose.addEventListener('click', messangerCloseHandler);
  
  function messangerCloseHandler() {
    
    meassangerBox.style.display = "none";
  }
  