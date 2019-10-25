window.addEventListener("DOMContentLoaded", init);

const preloader={
  visible:true,
  wrapper:null,
  setup(){
    wrapper = document.createElement("div");
    for(let i=0; i<5; i++){
      const kid = document.createElement("div");
      kid.style.animationDelay=Number("0."+i-0.2)+"s"
      wrapper.appendChild(kid);
    }
    wrapper.id="preloader";
    document.body.prepend(wrapper);
  },
  _setVisible(visible){
    this.visible=visible;
    wrapper.style.display = this.visible ? "flex":"none";
  },
  toggle(){
    this._setVisible(!this.visible);
  },
  hide(){
    this._setVisible(false);
  },
  show(){
    this._setVisible(true);
  },
}
function setupSearch(){
  const form=document.querySelector("form");
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const searchFor = document.querySelector("#searchField").value;
    getData(searchFor)
    document.querySelector("#posts").innerHTML="";
    preloader.show()
  })
}
function init(){
  setupSearch();
  preloader.setup();
  getData();
}
function setupNav(){
  //http://kea-alt-del.dk/t9_2019_autumn/wp-json/wp/v2/categories
}
function getData(search=""){
  console.log("getData")
  const searchParam = search ? "&search="+search:""
  fetch("https://kea-alt-del.dk/t9_2019_autumn/wp-json/wp/v2/book?_embed"+searchParam)
    .then(res=>res.json())
    .then(handleData)
}
function handleData(myData){
  //console.log(myData);
  preloader.hide();
  //1 loop
  myData.forEach(showPost)
}
function showPost(post){
  console.log(post)
  const imgPath = 
    post._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url;
  
  //2. cloning a template
  const template = document.querySelector(".postTemplate").content;
  const postCopy = template.cloneNode(true);
  //3. textcontent & innerHTML
  const h1 = postCopy.querySelector("h1");
  h1.textContent=post.title.rendered;
  
  const img = postCopy.querySelector("img.cover");
  img.setAttribute("src", imgPath)
  const content = postCopy.querySelector("section");
  content.innerHTML=post.content.rendered;
  
  const publisher = postCopy.querySelector(".publisher");
  publisher.innerHTML=post.publisher;
  
  //4 append
  document.querySelector("#posts").appendChild(postCopy)
}