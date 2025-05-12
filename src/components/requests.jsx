import { useContext } from "react";
import RequestContext from "../context/request-context";
import RemoveRequest from "./removeRequest";
import AcceptRequest from "./acceptRequest";
import RejectRequest from "./rejectRequest";

const Requests = () => {
  const { requests } = useContext(RequestContext);

  const sent = requests?.sent;
  const received = requests?.received;

  return (
    <div>
      <h2 className="heading">Requests Sent</h2>
      <div className="chatters">
        {sent &&
          (sent.length > 0 ? (
            sent.map((req) => (
              <div key={req.id} className="card">
                <div className="card__img">
                  <img
                    src={
                      req.receiver.profile.imageUrl ||
                      "/src/assets/profile.jpeg"
                    }
                    alt=""
                  />
                </div>
                <div className="card__title">
                  {`${req.receiver.profile.firstname} ${req.receiver.profile.lastname}`.trim()}
                </div>
                <RemoveRequest requestId={req.id} />
              </div>
            ))
          ) : (
            <div className="card card-empty">
              You have not sent any requests.
            </div>
          ))}
      </div>

      <h2 className="heading">Requests Received</h2>
      <div className="chatters">
        {received &&
          (received.length > 0 ? (
            received.map((req) => (
              <div key={req.id} className="card">
                <div className="card__img">
                  <img
                    src={
                      req.sender.profile.imageUrl || "/src/assets/profile.jpeg"
                    }
                    alt=""
                  />
                </div>
                <div className="card__title">
                  {`${req.sender.profile.firstname} ${req.sender.profile.lastname}`.trim()}
                </div>
                <AcceptRequest requestId={req.id} />
                <RejectRequest requestId={req.id} />
              </div>
            ))
          ) : (
            <div className="card card-empty">
              You have not received any requests.
            </div>
          ))}
      </div>
    </div>
  );
};

export default Requests;
