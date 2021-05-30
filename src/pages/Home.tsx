import React from "react";

const Home = () => {
  const icons = [
    "vicon-home",
    "vicon-box",
    "vicon-shopping-bag",
    "vicon-discount",
    "vicon-profile",
    "vicon-graph",
    "vicon-documents",
    "vicon-compose",
    "vicon-mail",
    "vicon-tree-structure",
    "vicon-pictures-folder",
    "vicon-adjust",
    "vicon-squared-menu",
    "vicon-notification",
    "vicon-menu-f",
    "vicon-notification-f",
    "vicon-pen-f",
    "vicon-trash",
    "vicon-megaphone",
    "vicon-dashboard",
    "vicon-people",
    "vicon-tools",
    "vicon-gear",
    "vicon-business",
    "vicon-calendar",
    "vicon-certificate",
    "vicon-key",
    "vicon-resume",
    "vicon-ruler",
    "vicon-workflow",
    "vicon-denied",
    "vicon-design",
    "vicon-email-open",
    "vicon-hourglass",
    "vicon-inspection",
    "vicon-one-finger",
    "vicon-new-document",
  ];
  return (
    <div>
      Ini Home
      <div>
        {icons.map((icon) => (
          <React.Fragment key={icon}>
            <span style={{ marginRight: 10 }}>{icon}</span>
            <i className={`vicon ${icon}`} />
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Home;
