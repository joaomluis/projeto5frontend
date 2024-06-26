import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
} from "reactstrap";

import { useRef } from "react";
import { useTranslation } from 'react-i18next';

import useAllUsersStore from "store/useAllUsersStore.jsx";
import useUserStore from "store/useUserStore.jsx";
import Spinner from "../components/Spinner/Spinner.jsx";
import { textFilter } from "react-bootstrap-table2-filter";
import { useNavigate } from "react-router-dom";

import "../assets/css/general-css.css";

import UsersWebsocket from "../assets/websocket/usersWebsocket.js";

import DynamicTable from "components/Dynamic Table/dynamic-table";
import CreateUser from "components/Modals/Create-user.jsx";

import { useEffect, useState } from "react";

function UsersTable() {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const allUsers = useAllUsersStore((state) => state.allUsers);
  const getAllUsers = useAllUsersStore((state) => state.getAllUsers);

  const token = useAllUsersStore((state) => state.token);

  const userType = useUserStore((state) => state.userType);


  useEffect(() => {
    if (token === null) {
      navigate('/auth/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    useAllUsersStore
      .getState()
      .getAllUsers()
      .then(() => {
        
        setLoading(false);
      });
  }, []);

  const ws = UsersWebsocket();

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = () => {
        getAllUsers(); 
      };
    }
  }, [ws, ws.current]);

  const columns = [
    {
      dataField: "active",
      text: "Status",
      formatter: (cell) => {
        switch (cell) {
          case true:
            return t("active");
          case false:
            return t("inactive");
          default:
            return cell;
        }
      }
    },
    {
      dataField: "username",
      text: "Username ",
      filter: textFilter(),
      sort: true,
    },
    {
      dataField: "typeOfUser",
      text: t("role"),
      filter: textFilter(),
      formatter: (cell) => {
        switch (cell) {
          case "product_owner":
            return "Product Owner";
          case "scrum_master":
            return "Scrum Master";
          case "developer":
            return "Developer";
          default:
            return cell;
        }
      },
    },
    {
      dataField: "firstName",
      text: t("firstName"),
    },
    {
      dataField: "lastName",
      text: t("lastName"),
    },
    {
      dataField: "email",
      text: "Email",
    },

    
  ];

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      navigate(`/agile-up/user/${row.username}`);
    },
  };

  const keyField = "username";

  const changeCreateUserRef = useRef();

  return (
    <>
      <div className="content">
        <CreateUser ref={changeCreateUserRef} />
        <Row>
          <Col md="12">
            <Card>
              <Row>
                <Col md="10">
                  <CardHeader>
                    <CardTitle tag="h4" className="all-users-table-tittle">
                    {t('allUsers')}
                    </CardTitle>
                  </CardHeader>
                </Col>
                {userType === "product_owner" ?(
                <Col
                  md="2"
                  className="d-flex justify-content-center align-items-center"
                >
                  <Button
                    className="btn-round add-user-button"
                    style={{ backgroundColor: "#3f74a6" }}
                    onClick={() => changeCreateUserRef.current.handleShow()}
                  >
                    {t('addUser')}
                  </Button>
                </Col>
                ) : null}
              </Row>

              <CardBody>
                {loading ? (
                  <Spinner animation="border" role="status"></Spinner>
                ) : (
                  <DynamicTable
                    keyField={keyField}
                    data={allUsers}
                    columns={columns}
                    rowEvents={rowEvents}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UsersTable;
