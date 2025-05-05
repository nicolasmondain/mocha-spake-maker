# <div style="text-align: center; font-size: 5em;">🫀</div> Space Maker

A **spec [space] maker** (that generates/validates specifications from your test files).

The purpose of this repository is to automate the updating of Markdown documents in order to provide product managers with a clear view of a feature's health status and specifications.

Each Markdown file corresponds to a `describe` block, representing a specific feature. The test results listed in the Markdown are intended to highlight which specifications are covered by tests - demonstrating that the requested functionalities are properly secured.

Ideally, these files should be generated automatically by the CI.
Eventually, it should also be possible to edit the Markdown content from external tools such as Notion or Confluence.

> _While external documents can always provide additional technical context or extended specifications, the ultimate source of truth must remain in the codebase. Specifications should live close to the code and be synchronized, ensuring alignment between developers, QA, and product teams._

