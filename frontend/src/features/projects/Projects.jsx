import React, { useEffect, useState } from "react";
import moment from "moment";
import projectService from "@/features/projects/projectService";
import { Link } from "react-router-dom";
import { Delete, Edit, Search } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const fetchProjects = async (query = "") => {
    try {
      setLoading(true);
      const data = await projectService.getAll(query);
      setProjects(data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 3 || searchQuery.trim().length === 0) {
      const delayDebounce = setTimeout(() => {
        fetchProjects(searchQuery);
      }, 500);

      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const data = await projectService.remove(selectedProjectId);
      toast.success(data.message || "Project deleted successfully");
      setShowDeleteModal(false);
      await fetchProjects();
    } catch (error) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="centered-loader">Loading projects...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Project List</h2>
        {user && user.role == "Admin" && (
          <Link to="/projects/add">
            <button className="btn btn-primary">+ Add Project</button>
          </Link>
        )}
      </div>
      <div className="row">
        <div className="col-6 text-end">
          <form className="mb-3 d-flex justify-content-end" role="search">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Updated By</th>
              <th>Created At</th>
              {user && user?.role == "Admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                  <td>{project.status}</td>
                  <td>{project.createdBy?.username || "N/A"}</td>
                  <td>{project.updatedBy?.username || "N/A"}</td>
                  <td>
                    {moment(project.createdAt).format("MMM D, YYYY hh:mm A")}
                  </td>
                  {user && user?.role == "Admin" && (
                    <td>
                      <div className="d-flex">
                        <Link
                          to={`/projects/edit/${project._id}`}
                          className="btn btn-sm btn-warning me-2"
                        >
                          <Edit className="me-1" size={16} />
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            setSelectedProjectId(project._id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Delete className="me-1" size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this project?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
