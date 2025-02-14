export function ProfileCard({ phone, name, email, image }: { phone: string; name: string; email: string; image: string; }) {
  return (
    <div class="profile"
      style={{
        padding: "10px",
        display: "flex", "align-items": "center", gap: "10px",
      }}>
      <img
        style={{
          "border-radius": "10px",
          "box-shadow": "0 8px 10px rgba(0, 0, 0, 0.26)",
        }}
        width={"100px"} src={image} alt="" />

      <div class="text"
        style={{
          "padding-top": "10px",
          "line-height": "0px",
        }}>
        <h3>{name}</h3>
        <p
          style={{
            color: "gray",
            "font-size": "16px",
            display: "flex",
            "align-items": "center",
            gap: "6px",
          }}
        ><svg fill="gray" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
            <path d="M1920 428.266v1189.54l-464.16-580.146-88.203 70.585 468.679 585.904H83.684l468.679-585.904-88.202-70.585L0 1617.805V428.265l959.944 832.441L1920 428.266ZM1919.932 226v52.627l-959.943 832.44L.045 278.628V226h1919.887Z" fill-rule="evenodd" />
          </svg> <a style={{
            color: "gray"
          }} href={`mailto:${email}`}>{email}</a></p>
        <p style={{
          color: "gray",
          "font-size": "16px",
          display: "flex",
          "align-items": "center",
          gap: "6px",
        }}>
          <svg fill="gray" width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.13948 12.7696C3.76094 10.2681 3 7.29713 3 4L4.96733 3.5081C5.68758 3.32804 6.0477 3.238 6.37009 3.29854C6.65417 3.35188 6.91678 3.48615 7.12635 3.68522C7.36417 3.91113 7.50204 4.25579 7.77776 4.9451L8.48846 6.72184C8.67477 7.18763 8.76793 7.42053 8.784 7.65625C8.79821 7.86484 8.76867 8.07409 8.69726 8.27058C8.61655 8.49264 8.46255 8.69065 8.15456 9.08664L5.13948 12.7696ZM5.13948 12.7696C6.66062 15.5299 8.93373 17.7184 11.7662 19.1428M11.7662 19.1428C14.1523 20.3425 16.9352 21 20 21L20.4916 19.0324C20.6717 18.3121 20.7617 17.952 20.7012 17.6296C20.6478 17.3456 20.5136 17.0829 20.3145 16.8734C20.0886 16.6355 19.7439 16.4977 19.0546 16.222L17.4691 15.5877C16.9377 15.3752 16.672 15.2689 16.4071 15.2608C16.1729 15.2536 15.9404 15.3013 15.728 15.4001C15.4877 15.512 15.2854 15.7143 14.8807 16.119L11.7662 19.1428ZM20.9997 7V3M20.9997 3H16.9997M20.9997 3L14.9997 9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <a style={{
            color: "gray"
          }} href={`tel:{phone}`}>{phone}</a>
        </p>

      </div>

    </div>
  );
}
