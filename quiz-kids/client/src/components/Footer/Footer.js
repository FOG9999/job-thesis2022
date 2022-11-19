import React from "react";
import styles from "./footer.module.css";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import { useSelector } from "react-redux"

function Footer() {
  const isLanguageEnglish = useSelector((state) => state.language.isEnglish)
  return (
    <footer className={styles.footer}>
      <div className={styles["footer-container"]}>
        <div className={styles["footer-row"]}>
          <div className={styles["footer-column"]}>
            <h4>{isLanguageEnglish ? "About" : "Chúng tôi"}</h4>
            <ul>
              <li>
                <a href="/">{isLanguageEnglish ? "Company" : "Công ty"}</a>
              </li>
              <li>
                <a href="/">{isLanguageEnglish ? "Service" : "Dịch vụ"}</a>
              </li>
              <li>
                <a href="/">Blog</a>
              </li>
              <li>
                <a href="/">{isLanguageEnglish ? "Contact" : "Liên hệ"}</a>
              </li>
            </ul>
          </div>
          <div className={styles["footer-column"]}>
            <h4>{isLanguageEnglish ? "Application" : "Ứng dụng"}</h4>
            <ul>
              <li>
                <a href="/">{isLanguageEnglish ? "At home" : "Tại nhà"}</a>
              </li>
              <li>
                <a href="/">{isLanguageEnglish ? "At school" : "Tại trường học"}</a>
              </li>
              <li>
                <a href="/">{isLanguageEnglish ? "At work" : "Tại nơi làm việc"}</a>
              </li>
            </ul>
          </div>
          <div className={styles["footer-column"]}>
            <h4>{isLanguageEnglish ? "Terms and conditions" : "Điều khoản và quy định"}</h4>
            <ul>
              <li>
                <a href="/">
                  {isLanguageEnglish ? "Terms and conditions" : "Điều khoản và quy định"}
                </a>
              </li>
              <li>
                <a href="/">
                  {isLanguageEnglish
                    ? "Privacy Policy"
                    : "Chính sách bảo mật"}
                </a>
              </li>
            </ul>
          </div>
          <div className={styles["footer-column"]}>
            <h4>{isLanguageEnglish ? "Follow us" : "Theo dõi chúng tôi"}</h4>
            <div className={styles["footer-social-links"]}>
              <a href="/">
                <FacebookIcon />
              </a>
              <a href="/">
                <TwitterIcon />
              </a>
              <a href="/">
                <InstagramIcon />
              </a>
              <a href="/">
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
