import { forwardRef, useImperativeHandle, useState } from "react";

import Modal from "react-bootstrap/Modal";

import {
  Button,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Container,
  Label,
} from "reactstrap";

import "../../assets/css/general-css.css";
import useCategoriesStore from "../../store/useCategoriesStore.jsx";

const CreateCategory = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setTitleValue("");
    setDescriptionValue("");
    setShow(false);
  };

  const [modalFunction, setModalFunction] = useState("Add Category");

  const handleShow = (categoryData) => {
    if (categoryData) {
      setTitleValue(categoryData.title);
      setDescriptionValue(categoryData.description);
      setCurrentCategory(categoryData);
      setModalFunction("Edit Category");
    } else {
      setTitleValue("");
      setDescriptionValue("");
      setCurrentCategory(null);
      setModalFunction("Add Category");
    }

    setShow(true);
  };

  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);

  useImperativeHandle(ref, () => ({
    handleShow,
  }));

  const createCategory = useCategoriesStore((state) => state.createCategory);
  const updateCategory = useCategoriesStore((state) => state.updateCategory);

  async function handleCreateOrUpdateCategory() {
    const categoryData = {
      title: titleValue,
      description: descriptionValue,
    };

    if (currentCategory) {
      updateCategory(categoryData, currentCategory.idCategory).then(
        (response) => {
          if (response.success) {
            handleClose();
          }
        }
      );
    } else {
      createCategory(categoryData).then((response) => {
        if (response.success) {
          handleClose();
        }
      });
    }
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>{modalFunction}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <Row>
                <Col className="pr-1" md="12">
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      type="text"
                      value={titleValue}
                      onChange={(e) => setTitleValue(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col className="pr-1" md="12">
                  <FormGroup>
                    <Label>Description</Label>
                    <Input
                      name="text"
                      type="textarea"
                      value={descriptionValue}
                      onChange={(e) => setDescriptionValue(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button color="danger" onClick={handleClose}>
            Close
          </Button>
          <Button color="primary" onClick={handleCreateOrUpdateCategory}>
            {modalFunction}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
});

export default CreateCategory;