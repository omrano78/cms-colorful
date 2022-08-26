import React, { useEffect, useState } from "react";
import Link from "next/link";

const NavigationList = ({ data, logo }) => {
  const [list, setList] = useState(JSON.parse(unescape(data)));
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoImage] = useState(
    logo != null
      ? logo
      : "https://content.coremodels.io/api/assets/coremodels/a2463216-2547-42d7-a758-e16ebe8366fb/logo-wide.png"
  );
  const [activeMenu, setActiveMenu] = useState(null);
  const [isActiveMenuBtn, setIsActiveMenuBtn] = useState(false);
  useEffect(() => {
    let lastScrollTop = 0;
    let width = window.innerWidth;
    window.addEventListener("scroll", function () {
      if (width >= 991) {
        let st = window.pageYOffset || document.documentElement.scrollTop;
        st > lastScrollTop ? setIsScrolled(true) : setIsScrolled(false);
      }
    });
  }, []);
  return (
    <header className={`header-area ${isScrolled ? "header-sticky" : ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <Link href="/">
                <a className="logo">
                  <img src={logoImage} alt="Logo" />
                </a>
              </Link>

              <ul className={isActiveMenuBtn ? "nav active" : "nav"}>
                {list.map((menuItem, index) => {
                  return (
                    <li
                      key={index}
                      className={menuItem.list.children.length > 0 ? "submenu" : ""}
                      onClick={() => {
                        if (menuItem.list.children.length > 0) {
                          activeMenu == menuItem.id ? setActiveMenu(null) : setActiveMenu(menuItem.id);
                        }
                      }}
                    >
                      {menuItem.list.children.length > 0 ? (
                        <React.Fragment>
                          <a href="#" className={" " + menuItem.list.cssClass != null && menuItem.list.cssClass}>
                            {menuItem.list.title}
                          </a>

                          <ul className={activeMenu == menuItem.id ? "active" : ""}>
                            {menuItem.list.children.map((submenu, i) => (
                              <li key={i}>
                                <Link href={submenu.link}>{submenu.title}</Link>
                              </li>
                            ))}
                          </ul>
                        </React.Fragment>
                      ) : (
                        <Link href={menuItem.list.link}>
                          <a className={" " + menuItem.list.cssClass != null && menuItem.list.cssClass}>
                            {menuItem.list.title}
                          </a>
                        </Link>
                      )}
                    </li>
                  );
                  //   return (
                  //     <li
                  //       key={index}
                  //       className={hasSublist(list, menuItem.id) == true ? "submenu" : ""}
                  //       onClick={() => {
                  //         if (hasSublist(list, menuItem.id)) {
                  //           activeMenu == menuItem.id ? setActiveMenu(null) : setActiveMenu(menuItem.id);
                  //         }
                  //       }}
                  //     >
                  //       <Link href={menuItem.data.linkUrl.iv}>
                  //         <a
                  //           className={
                  //             menuItem.data.cssClassRef != null
                  //               ? renderCssClasses("", menuItem.data.cssClassRef.iv)
                  //               : ""
                  //           }
                  //         >
                  //           {menuItem.data.linkLabel.iv}
                  //         </a>
                  //       </Link>
                  //       {renderSubList(list, menuItem.id, activeMenu)}
                  //     </li>
                  //   );
                  // }
                })}
              </ul>

              <button
                className={isActiveMenuBtn ? "menu-trigger active" : "menu-trigger"}
                onClick={() => setIsActiveMenuBtn(!isActiveMenuBtn)}
              >
                <span>Menu</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationList;
