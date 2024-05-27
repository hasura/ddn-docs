import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

export const InstallTheCli = () => {
  return (
    <div>
      You can download the CLI binary below and start using it immediately. Please follow the instructions for your system.

      <Tabs groupId="os-preference" className="api-tabs">

        <TabItem value="macOS-or-linux" label="macOS and Linux">

          Simply run the installer script in your terminal:

          ```bash
          curl -L https://graphql-engine-cdn.hasura.io/ddn/cli/v1/get.sh | bash
          ```

        </TabItem>

        <TabItem value="windows" label="Windows">
          Download the latest `cli-ddn-windows-amd64.exe` binary and run it.

          ```bash
          curl -L https://graphql-engine-cdn.hasura.io/ddn/cli/v1/latest/cli-ddn-windows-amd64.exe -o ddn.exe
          ```

          :::info Unrecognized application warning

          In Windows, if you get an "Unrecognized application" warning, click "Run anyway".

          :::

        </TabItem>
      </Tabs>
    </div>
  )
}