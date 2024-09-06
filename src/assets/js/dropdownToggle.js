// dropdownToggle.js

export const handleToggle = (e) => {
    const target = e.target;
    const navMenuDiv = document.getElementById("nav-content");
    const navMenu = document.getElementById("nav-toggle");
  
    if (!checkParent(target, navMenuDiv)) {
      if (checkParent(target, navMenu)) {
        if (navMenuDiv.classList.contains("hidden")) {
          navMenuDiv.classList.remove("hidden");
        } else {
          navMenuDiv.classList.add("hidden");
        }
      } else {
        navMenuDiv.classList.add("hidden");
      }
    }
  };
  
  export const checkParent = (t, elm) => {
    while (t.parentNode) {
      if (t === elm) {
        return true;
      }
      t = t.parentNode;
    }
    return false;
  };  