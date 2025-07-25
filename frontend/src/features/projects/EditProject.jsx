import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import projectService from "./projectService";

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title cannot exceed 50 characters"),
  description: yup
    .string()
    .required("Description is required")
    .max(2000, "Description cannot exceed 2000 characters"),
});

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchProject = async () => {
    try {
      const data = await projectService.getById(id);
      setValue("title", data.data.title);
      setValue("description", data.data.description);
    } catch (err) {
      toast.error("Failed to fetch project.");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await projectService.update(id, data);
      toast.success(res.message || "Project updated successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border">
            <div className="card-body">
              <h4 className="mb-4">Edit Project</h4>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                    id="title"
                    {...register("title")}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${
                      errors.description ? "is-invalid" : ""
                    }`}
                    id="description"
                    rows="4"
                    {...register("description")}
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description.message}
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-between gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary w-50"
                    onClick={() => navigate("/dashboard")}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-50"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
