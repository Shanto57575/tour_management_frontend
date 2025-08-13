import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const UnAuthorized = () => {
  return (
    <div>
      <h1>You Are UnAuthorized</h1>
      <Button>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
};
