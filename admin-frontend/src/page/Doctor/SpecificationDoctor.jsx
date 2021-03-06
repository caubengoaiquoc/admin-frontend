import React, {useState, useEffect, useMemo, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {withRouter} from "react-router-dom";
import {isEmpty, debounce, throttle} from "lodash";

import {Done, Add, Clear, CancelRounded, ArrowBack} from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Chip, CircularProgress, Tooltip} from "@material-ui/core";
import {updateDoctorLanguage, updateDoctorExperience, updateDoctorSuccessful, updateDoctorDegree} from "../../redux/staff";

const SpecificationDoctor = props => {
    let typeSpec = props.type ?? 1;

    const {isLoad} = useSelector(state => state.ui);
    const allLanguage = useSelector(state => state.doctor.allLanguage);
    const allDegree = useSelector(state => state.doctor.allDegree);

    const status = useSelector(state => state.doctor.updateStatus);

    const dispatch = useDispatch();

    const [specData, setSpecData] = useState([{}]);
    const [langPool, setLangPool] = useState([{}]);
    const [degreePool, setDegreePool] = useState([{}]);
    const [expChange, setExpChange] = useState([]);
    const [preview, setPreview] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const handleCloseDialog = () => {
        props.closeDialog();
        setPreview(false);
        setConfirm(false);
        setSpecData([{}]);
        setLangPool([{}]);
    };

    const openPrevDialog = () => {
        props.openPreviousDialog(1, null);
        setPreview(false);
        setConfirm(false);
    };

    const delayedUpdatePreview = useRef(
        throttle(data => {
            setExpChange(data);
        }, 2000)
    ).current;

    const delayedUpdateData = useRef(
        debounce(data => {
            setSpecData(data);
        }, 1000)
    ).current;

    const handleExpInput = (e, index) => {
        e.preventDefault();
        let exp = [...specData];
        exp[index].content = e.target.value ?? "";
        let watch = [...expChange];
        watch[index] = e.target.value ?? "";

        // exp.splice(index, 1, e.target.value ?? "");
        delayedUpdateData(exp);
        delayedUpdatePreview(watch);
    };

    const handleExpField = (action, index) => {
        if (action === 0) {
            // Add 1 more input field
            setSpecData(specData => [...specData, {id: `createdAt_${Date.now()}`, content: null}]);
            setExpChange(expChange => [...expChange, ""]);
        } else {
            // Remove input field by index
            let exp = [...specData];
            exp.splice(index, 1);
            let expWatching = [...expChange];
            expWatching.splice(index, 1);

            setSpecData(exp);
            setExpChange(expWatching);
        }
    };

    const togglePreview = () => {
        if (preview) setPreview(false);
        else setPreview(true);
    };

    const handleSubmit = () => {
        switch (typeSpec) {
            case 1: //update exp
                let submitExp = {exps: []};
                if (!isEmpty(specData))
                    specData.map(data => {
                        if (data?.content) {
                            let newExp = data.content.trim();
                            if (newExp.charAt(0) === "✓") submitExp.exps.push({content: newExp});
                            else submitExp.exps.push({content: "✓ " + newExp});
                        }
                    });

                dispatch(updateDoctorExperience(props.doctorData?.id, submitExp));
                break;

            case 2: //update lang
                let submitLang = {languages: []};
                if (!isEmpty(specData))
                    specData.forEach(data => {
                        submitLang.languages.push({language_id: data.language_id});
                    });

                dispatch(updateDoctorLanguage(props.doctorData?.id, submitLang));
                break;

            case 3: //update degree
                let submitDegree = {degrees: []};
                if (!isEmpty(specData))
                    specData.forEach(data => {
                        submitDegree.degrees.push({degree_id: data.degree_id});
                    });
                    
                console.log(submitDegree);

                dispatch(updateDoctorDegree(props.doctorData?.id, submitDegree));
                break;

            default:
                break;
        }
    };

    const createLanguagePool = () => {
        if (isEmpty(allLanguage)) {
            setLangPool(null);
        } else {
            let pool = allLanguage;

            //set addable == action where: language_id (specData) << NOT MATCH >> id (allLanguage)
            let compareData = allLanguage.filter(({id: id1}) => !props.data.some(({language_id: id2}) => id2 === id1));
            pool.map(data => {
                compareData.map(compare => {
                    if (compare.id === data.id) data.addable = true;
                });
            });
            setLangPool(pool);
        }
    };

    const updateLanguagePool = (isAddAble, language_id) => {
        let pool = langPool;
        for (const data of pool) {
            if (data.id === language_id) {
                data.addable = isAddAble;
                break;
            }
        }
        setLangPool(pool);
    };

    const createDegreePool = () => {
        if (isEmpty(allDegree)) {
            setDegreePool(null);
        } else {
            let pool = allDegree;

            //set addable == true where: degree_id (specData) << NOT MATCH >> id (allDegree)
            let compareData = allDegree.filter(({id: id1}) => !props.data.some(({degree_id: id2}) => id2 === id1));
            pool.map(data => {
                compareData.map(compare => {
                    if (compare.id === data.id) data.addable = true;
                });
            });
            setDegreePool(pool);
        }
    };

    const updateDegreePool = (isAddAble, degree_id) => {
        let pool = degreePool;
        for (const data of pool) {
            if (data.id === degree_id) {
                data.addable = isAddAble;
                break;
            }
        }
        setDegreePool(pool);
    };

    const createExpWatching = () => {
        let exp = [];
        if (!isEmpty(props.data)) {
            props.data.map(data => {
                exp.push(data.content ?? "");
            });
        }

        setExpChange(exp);
    };

    const handleDeleteLanguage = deleteLang => {
        setSpecData(data => data.filter(currentData => currentData.language_id !== deleteLang.language_id));
        updateLanguagePool(true, deleteLang.language_id);
    };

    const handleAddLanguage = addLang => {
        if (addLang.addable) {
            setSpecData(specData => [...specData, {language_id: addLang.id, language_name: addLang.name}]);
            updateLanguagePool(false, addLang.id);
        }
    };

    const handleDeleteDegree = deleteDegree => {
        setSpecData(data => data.filter(currentData => currentData.degree_id !== deleteDegree.degree_id));
        updateDegreePool(true, deleteDegree.degree_id);
    };

    const handleAddDegree = addDegree => {
        if (addDegree.addable) {
            setSpecData(specData => [...specData, {degree_id: addDegree.id, degree_name: addDegree.name}]);
            updateDegreePool(false, addDegree.id);
        }
    };

    const renderPreview = isEmpty(expChange) ? (
        <div>Chưa có dữ liệu</div>
    ) : (
        expChange?.map((data, index) => <div key={index}>{data ? (data.trim().charAt(0) === "✓" ? data.trim() : `✓ ${data.trim()}`) : ""}</div>)
    );

    const renderSpec = useMemo(
        () =>
            isEmpty(specData) ? (
                <div>Chưa có dữ liệu</div>
            ) : typeSpec === 1 ? (
                specData?.map((data, index) => (
                    <div key={data.id} className="doctor-spec-exp">
                        <TextField
                            fullWidth
                            multiline
                            rowsMax={4}
                            size="small"
                            placeholder="Kinh nghiệm, Lịch sử làm việc,..."
                            defaultValue={data.content ? data.content.replace(/✓?/, "").trim() : ""}
                            variant="outlined"
                            onChange={e => handleExpInput(e, index)}
                        />
                        <Button disabled={isLoad} onClick={() => handleExpField(1, index)} size="small" color="secondary">
                            <Clear />
                        </Button>
                    </div>
                ))
            ) : typeSpec === 2 ? (
                specData?.map(data => (
                    <div className="doctor-spec-chip" key={data.language_id}>
                        <Chip
                            className="spec-chip"
                            variant="outlined"
                            label={data.language_name ?? ""}
                            onDelete={() => handleDeleteLanguage(data)}
                            color="secondary"
                        />
                    </div>
                ))
            ) : (
                specData?.map(data => (
                    <div className="doctor-spec-chip" key={data.degree_id}>
                        <Chip
                            className="spec-chip"
                            variant="outlined"
                            label={data.degree_name ?? ""}
                            onDelete={() => handleDeleteDegree(data)}
                            color="secondary"
                        />
                    </div>
                ))
            ),
        [specData]
        //  useMemo: React (will) update/re-render this component only if data of specData is changing/changed
        //  This stuff helps improve performance (cause by (MaterialUI's TextField) onChange() issue)
    );

    const renderLanguagePool = isEmpty(langPool)
        ? "Không có dữ liệu"
        : langPool.map(data => (
              <div key={data.id} className="doctor-spec-chip">
                  {!data.addable ? (
                      <Chip
                          className="spec-chip chip-added"
                          label={data.name}
                          deleteIcon={<Done style={{color: "#fff"}} />}
                          onClick={() => handleAddLanguage(data)}
                          onDelete={() => handleAddLanguage(data)}
                      />
                  ) : (
                      <Chip
                          variant="outlined"
                          className="spec-chip"
                          label={data.name}
                          deleteIcon={<Add />}
                          onClick={() => handleAddLanguage(data)}
                          onDelete={() => handleAddLanguage(data)}
                      />
                  )}
              </div>
          ));

    const renderDegreePool = isEmpty(degreePool)
        ? "Không có dữ liệu"
        : degreePool.map(data => (
              <div key={data.id} className="doctor-spec-chip">
                  {!data.addable ? (
                      <Chip
                          className="spec-chip chip-added"
                          label={data.name}
                          deleteIcon={<Done style={{color: "#fff"}} />}
                          onClick={() => handleAddDegree(data)}
                          onDelete={() => handleAddDegree(data)}
                      />
                  ) : (
                      <Chip
                          variant="outlined"
                          className="spec-chip"
                          label={data.name}
                          deleteIcon={<Add />}
                          onClick={() => handleAddDegree(data)}
                          onDelete={() => handleAddDegree(data)}
                      />
                  )}
              </div>
          ));

    useEffect(() => {
        if (status) {
            handleCloseDialog();
            dispatch(updateDoctorSuccessful(false));
        }
    }, [status]);

    useEffect(() => {
        setSpecData(props.data);
        switch (typeSpec) {
            case 1:
                createExpWatching();
                break;
            case 2:
                createLanguagePool();
                break;
            case 3:
                createDegreePool();
                break;

            default:
                break;
        }
    }, [props.data, props.type, allLanguage, allDegree]);

    return (
        <Dialog fullWidth={true} maxWidth="lg" open={props.dialogVisible} onClose={() => handleCloseDialog()} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                {typeSpec === 2 && "Chỉnh sửa khả năng ngôn ngữ Bác sĩ " + props.doctorData?.fullname}
                {typeSpec === 3 && "Chỉnh sửa bằng cấp/chứng chỉ Bác sĩ " + props.doctorData?.fullname}
            </DialogTitle>
            <DialogContent>
                {typeSpec === 1 ? (
                    <>
                        <div className="doctor-spec-wrapper">
                            <div className="doctor-specification-name">Cập nhật kinh nghiệm Bác sĩ {props.doctorData?.fullname}</div>
                            <Tooltip title={preview ? "" : "Tính năng thử nghiệm"}>
                                <div className="doctor-specification-name doctor-exp-preview-toggle" onClick={() => togglePreview()}>
                                    {preview ? "Đóng xem trước" : "Xem trước chỉnh sửa"}
                                </div>
                            </Tooltip>
                        </div>
                        <div className="doctor-spec-wrapper">
                            <div className="doctor-spec-exp-field">
                                <div className="doctor-exp-content">{renderSpec}</div>
                                <div className="doctor-exp-content">
                                    <Button disabled={isLoad} onClick={() => handleExpField(0, null)} variant="outlined" size="small">
                                        <Add />
                                    </Button>
                                </div>
                            </div>
                            <div className={`doctor-spec-preview ${preview ? "" : "doctor-spec-preview-fadeout"}`}>
                                {preview ? renderPreview : ""}
                            </div>
                        </div>
                    </>
                ) : typeSpec === 2 ? (
                    <div className="doctor-spec-wrapper">
                        <div className="doctor-spec-language-added">
                            <div className="doctor-specification-name">Khả năng ngôn ngữ hiện tại</div>
                            <div className="doctor-spec-desc">
                                Nhấn <CancelRounded style={{fontSize: "16px", color: "#f50057"}} /> để xoá ngôn ngữ.
                            </div>
                            <div className="doctor-spec-content">{renderSpec}</div>
                        </div>
                        <div className="doctor-spec-language">
                            <div className="doctor-specification-name">
                                Danh sách ngôn ngữ<b>*</b>
                            </div>
                            <div className="doctor-spec-desc">
                                Vào mục <i>Quản lý Kĩ năng</i> ­ để cập nhật ngôn ngữ.
                            </div>
                            <div className="doctor-spec-content">{renderLanguagePool}</div>
                            <p>
                                <b>*</b>: Chỉ ngôn ngữ được chấp nhận bởi hệ thống
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="doctor-spec-wrapper">
                        <div className="doctor-spec-language-added">
                            <div className="doctor-specification-name">Bằng cấp, Chứng chỉ hiện tại</div>
                            <div className="doctor-spec-desc">
                                Nhấn <CancelRounded style={{fontSize: "16px", color: "#f50057"}} /> để xoá.
                            </div>
                            <div className="doctor-spec-content">{renderSpec}</div>
                        </div>
                        <div className="doctor-spec-language">
                            <div className="doctor-specification-name">
                                Danh sách bằng cấp & chứng chỉ<b>*</b>
                            </div>
                            <div className="doctor-spec-desc">
                                Vào mục <i>Quản lý Kĩ năng</i> ­ để cập nhật bằng cấp/chứng chỉ.
                            </div>
                            <div className="doctor-spec-content">{renderDegreePool} </div>
                            <p>
                                <b>*</b>: Được chấp nhận bởi hệ thống
                            </p>
                        </div>
                    </div>
                )}
                <div className="doctor-specification-button">
                    {confirm ? (
                        <div className="doctor-spec-alert">
                            <Alert
                                severity="warning"
                                action={
                                    <div>
                                        <Tooltip title={isLoad ? "Đang gửi yêu cầu" : "Xác nhận"}>
                                            <Button color="primary" size="small" onClick={() => handleSubmit()}>
                                                {isLoad ? <CircularProgress size={20} /> : <Done />}
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Huỷ">
                                            <Button color="secondary" size="small" disableElevation onClick={() => setConfirm(false)}>
                                                <Clear />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                }
                            >
                                Xác nhận <strong>cập nhật</strong>{" "}
                                {typeSpec === 1 ? "kinh nghiệm" : typeSpec === 2 ? "khả năng ngôn ngữ" : "bằng cấp/chứng chỉ"} của BS{" "}
                                {props.doctorData?.fullname ?? "này"} như trên?
                            </Alert>
                        </div>
                    ) : (
                        <Button disabled={isLoad} variant="outlined" onClick={() => setConfirm(true)} color="primary">
                            Cập nhật
                        </Button>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <div className="doctor-spec-dialog-button">
                    <Button onClick={() => openPrevDialog()}>
                        <ArrowBack /> ­ ­ Quay lại
                    </Button>
                    <Button onClick={() => handleCloseDialog()} color="secondary">
                        Huỷ chỉnh sửa và đóng
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    );
};

export default withRouter(SpecificationDoctor);
