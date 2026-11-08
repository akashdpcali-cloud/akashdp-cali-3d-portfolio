export default function SocialPreview() {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "70px",
        background: "#080808",
        color: "#ffffff",
        fontFamily: "Arial",
        border: "2px solid #292929",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "22px",
        }}
      >
        <div
          style={{
            color: "#ef2525",
            fontSize: "25px",
            fontWeight: 700,
            letterSpacing: "7px",
          }}
        >
          PORTFOLIO
        </div>

        <div
          style={{
            fontSize: "76px",
            fontWeight: 900,
            letterSpacing: "-3px",
          }}
        >
          AKASH D P
        </div>

        <div
          style={{
            color: "#ef2525",
            fontSize: "35px",
            fontWeight: 800,
          }}
        >
          3D FULL-STACK DEVELOPER
        </div>

        <div
          style={{
            color: "#b5b5b5",
            fontSize: "23px",
          }}
        >
          Creative Developer · Interactive Web Experiences
        </div>

        <div
          style={{
            color: "#777777",
            fontSize: "19px",
            marginTop: "15px",
          }}
        >
          THREE.JS · REACT · NEXT.JS · GSAP · NODE.JS
        </div>
      </div>

      <div
        style={{
          width: "290px",
          height: "290px",
          borderRadius: "50%",
          border: "5px solid #ef2525",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ef2525",
          fontSize: "125px",
          fontWeight: 900,
          boxShadow: "0 0 50px #681010",
        }}
      >
        3D
      </div>
    </div>
  );
}
