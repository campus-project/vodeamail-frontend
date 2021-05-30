import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import TabPanel from "../../../components/ui/tabs/TabPanel";
import Contact from "./contact";
import Group from "./group";
import { Link as LinkDom } from "react-router-dom";
import MuiTabs from "../../../components/ui/tabs/MuiTabs";
import { useQueryTab } from "../../../utilities/hooks/query-tab.hook";

const Audience: React.FC<any> = () => {
  const { tab, setTab } = useQueryTab(2);

  const tabs: string[] = ["Contact", "Group"];

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant={"h5"}>Audience</Typography>
        <AudienceCreateButton tab={tab} />
      </Box>

      <MuiTabs
        value={tab}
        name={"campaign"}
        tabs={tabs}
        onChange={(value) => setTab(value)}
      />

      <Box mt={3}>
        <TabPanel value={tab} index={0}>
          <Contact />
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Group />
        </TabPanel>
      </Box>
    </>
  );
};

const AudienceCreateButton: React.FC<any> = ({ tab }) => {
  return (
    <>
      {tab === 0 ? (
        <Button
          component={LinkDom}
          to={"/apps/audience/contact/create"}
          variant={"contained"}
          color={"primary"}
        >
          Create Contact
        </Button>
      ) : null}

      {tab === 1 ? (
        <Button
          component={LinkDom}
          to={"/apps/audience/group/create"}
          variant={"contained"}
          color={"primary"}
        >
          Create Group
        </Button>
      ) : null}
    </>
  );
};

export default Audience;
