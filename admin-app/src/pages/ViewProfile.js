import React from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
    MDBBreadcrumb,
    MDBBreadcrumbItem
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user); // Parse the user object
    const firstName = parsedUser?.firstname;
    const lastName = parsedUser?.lastname;
    const mobile = parsedUser?.mobile;
    const email = parsedUser?.email;
    const address = parsedUser?.address;
    const image = parsedUser?.images.map(image => image.url);
    return (
        <section style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol>
                        <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                            <MDBBreadcrumbItem>
                                <Link to="/admin">Trang chủ</Link>
                            </MDBBreadcrumbItem>
                            <MDBBreadcrumbItem active>Thông tin cá nhân</MDBBreadcrumbItem>
                        </MDBBreadcrumb>
                    </MDBCol>
                </MDBRow>

                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src={image}
                                    alt="avatar"
                                    className="rounded-circle"
                                    style={{ width: '150px' }}
                                    fluid />
                                <p className="text-muted mb-1">Quản trị viên website</p>
                                <p className="text-muted mb-4">{address}</p>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Họ và tên</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{firstName + " " + lastName}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Địa chỉ Email</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{email}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Số điện thoại</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{mobile}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                                <hr />
                                <MDBRow>
                                    <MDBCol sm="3">
                                        <MDBCardText>Địa chỉ</MDBCardText>
                                    </MDBCol>
                                    <MDBCol sm="9">
                                        <MDBCardText className="text-muted">{address}</MDBCardText>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}