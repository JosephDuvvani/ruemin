import { useContext } from "react";
import RequestContext from "../context/request-context";

const Requests = () => {
  const { requests } = useContext(RequestContext);

  const sent = requests?.sent;
  const received = requests?.received;

  return (
    <div>
      <div>
        <h2>Requests Sent</h2>
        {sent &&
          (sent.length > 0 ? (
            sent.map((req) => (
              <div key={req.id}>
                <div>
                  <img
                    src={
                      req.receiver.profile.imageUrl ||
                      "/src/assets/profile.jpeg"
                    }
                    alt=""
                  />
                </div>
                <div>
                  {`${req.receiver.profile.firstname} ${req.receiver.profile.lastname}`.trim()}
                </div>
              </div>
            ))
          ) : (
            <div>You have not sent any requests.</div>
          ))}
      </div>

      <div>
        <h2>Requests Received</h2>
        {received &&
          (received.length > 0 ? (
            received.map((req) => (
              <div key={req.id}>
                <div>
                  <img
                    src={
                      req.receiver.profile.imageUrl ||
                      "/src/assets/profile.jpeg"
                    }
                    alt=""
                  />
                </div>
                <div>
                  {`${req.receiver.profile.firstname} ${req.receiver.profile.lastname}`.trim()}
                </div>
              </div>
            ))
          ) : (
            <div>You have not received any requests.</div>
          ))}
      </div>
    </div>
  );
};

export default Requests;
