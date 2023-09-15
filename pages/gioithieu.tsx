import Image from 'next/image';
import Link from "next/link";
import React from "react";
import { AiFillHome } from "react-icons/ai"
import styles from '@/styles/About.module.css';

const About = () => {
    return (
        <div>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div>
                        <a>
                            <Image
                                src="/logosmartshark.png"
                                alt="Smart Shark"
                                width={200}
                                height={200}
                                style={{
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                }}
                            />
                        </a>
                    </div>
                    <div className='header-menu'>
                        <ul className={styles.menunav}>
                            <li className={styles.li}><Link href="/" className={styles.navLink}>TRANG CHỦ</Link></li>
                            <li className={styles.about}><Link href="/gioithieu" className={styles.navLink}>GIỚI THIỆU</Link></li>
                            <li className={styles.li}><Link href="/lienhe" className={styles.navLink}>LIÊN HỆ</Link></li>
                        </ul>
                    </div>
                </div>
            </header>
            <div className="content_wapper home_wapper">
                <div className={styles.container_contact}>
                    <div className="padding_home head_title">
                        <h3 className={styles.h3}>GIỚI THIỆU</h3>
                    </div>
                    <div >
                        <p>
                            <p className={styles.p_header}>===========================================================</p>
                            <p className={styles.p_header}>
                                <b>XÂY DỰNG MÔ HÌNH MÁY HỌC ỨNG DỤNG TRONG CHATBOT HỖ TRỢ SINH VIÊN</b></p>
                            <p className={styles.p_header}>
                                <b>(BUILDING A MACHINE LEARNING BASED SYSTEM FOR CHATBOT APPLICATION)</b></p>
                            <p className={styles.p_header}>===========================================================</p>
                            &nbsp;</p>
                        <p className={styles.p_text}>
                            &nbsp; &nbsp;&nbsp; &nbsp;Với mong muốn tạo ra một mô hình Chatbot thông minh và tiện ích, hỗ trợ sinh viên giải
                            đáp các thắc mắc về quy chế, quy định và thông tin liên quan đến trường Đại học Bách Khoa Thành Phố Hồ Chí Minh
                            nhóm chúng tôi đã cùng nhau xây dựng và phát triển nên trợ lí ảo mang tên SmartShark.
                        </p>
                        <p className={styles.p_text}>
                            &nbsp; &nbsp;&nbsp; &nbsp;Với sự phát triển nhanh chóng của công nghệ và trí tuệ nhân tạo, Chatbot đã trở thành
                            một giải pháp tiềm năng trong việc cung cấp hỗ trợ tức thì và chính xác cho người dùng. Đặc biệt, chúng tôi tập
                            trung vào việc xây dựng mô hình máy học Speech to Text trong SmartShark, nhằm giúp cho việc giao tiếp với trợ lí ảo trở
                            nên thuận tiện hơn đối với những người dùng có khó khăn trong việc gõ văn bản. Mô hình này cho phép SmartShark
                            chuyển đổi giọng nói của người dùng thành văn bản, giúp tăng cường tương tác và truyền đạt thông tin một cách
                            tự nhiên và hiệu quả.
                        </p>
                        <p className={styles.p_text}>
                            &nbsp; &nbsp;&nbsp; &nbsp;Trợ lí SmartShark có giao diện Web thân thiện và dễ sử dụng, với hi vọng sẽ trở thành một nguồn
                            thông tin đáng tin cậy cho sinh viên Trường Đại học Bách Khoa TP HCM. Bằng cách tích hợp các nguồn dữ liệu về
                            quy chế, quy định, thông tin sinh viên và các trang web hỗ trợ sinh viên của nhà trường, SmartShark sẽ cung cấp câu trả lời chính xác và nhanh
                            chóng cho các câu hỏi phổ biến và không phổ biến mà sinh viên thường gặp phải.
                            Mục tiêu của đề tài này là giúp tiếp cận thông tin học tập và quản lý sinh viên trở nên dễ dàng hơn, tăng
                            cường tương tác giữa sinh viên và nhà trường thông qua một giao diện thân thiện và tiện ích. Đồng thời, việc
                            nghiên cứu và ứng dụng mô hình máy học Speech to Text trong Chatbot cũng đóng góp cho sự phát triển và ứng
                            dụng của trí tuệ nhân tạo trong lĩnh vực giáo dục.
                            Chúng tôi tin rằng đề tài luận văn này sẽ mang lại những giá trị thực tiễn trong việc
                            nâng cao trải nghiệm học tập và giải quyết các thắc mắc cho sinh viên, đồng thời góp phần phát triển sáng tạo
                            trong lĩnh vực công nghệ thông tin và trí tuệ nhân tạo.
                        </p>
                        <p className={styles.p_text}>
                            &nbsp; &nbsp;&nbsp; &nbsp;Xin chân thành cảm ơn quý thầy cô và các bạn đã dành thời gian chú ý phần giới thiệu của chúng tôi
                            rất mong nhận được những góp ý và phản hồi từ quý vị để hoàn thiện và nâng cao chất lượng đề tài luận văn này.
                        </p>
                        <p className={styles.p_text}>
                            &nbsp; &nbsp;&nbsp; &nbsp;Trân trọng cảm ơn!
                        </p>

                    </div>
                </div>
            </div>
            <footer className={styles.footer}>
                <a>
                    <Image
                        src="/logoBK.png"
                        alt="Smart Shark"
                        width={50}
                        height={50}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                    />
                    Bản quyền thuộc Trường Đại học Bách Khoa - ĐHQG-HCM
                </a>
            </footer>
        </div>

    );
};

export default About;