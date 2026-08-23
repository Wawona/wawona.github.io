+++
aliases = ["docs/reporting-bugs"]
title = "Report a bug"
description = "TestFlight feedback, copied logs, and the GitHub bug form."
weight = 6
date = 2026-08-22

+++

When Start does nothing, a machine will not appear, or a session looks wrong, file a GitHub issue with copied diagnostics. Discord is for chat. Issues are the record.

Open the form: [Wawona bug report](https://github.com/Wawona/Wawona/issues/new?template=bug.yml).

Canonical write-up in the repo: [reporting-bugs.md](https://github.com/Wawona/Wawona/blob/development/docs/reporting-bugs.md).

## What to send

1. What you tapped (Start, Focus, the machine name).
2. What you expected, and what you saw. "Nothing happened" is enough if that is what you saw.
3. The **Copied diagnostics** block from the app when you can. It includes Wawona version and build, host OS and device, install channel (TestFlight, Sideload, App Store, Simulator, macOS), the active machine without passwords, and recent log lines.

Sideloaded iOS IPAs do not send TestFlight crash mail. Copied logs are how we debug those builds.

Do not paste SSH passwords or key passphrases.

## TestFlight (Apple beta)

If Settings → About → **Install** is TestFlight, use both of these when you can.

**TestFlight feedback.** Crashes from a TestFlight build go to App Store Connect automatically. For a hang or a blank session: screenshot in Wawona, or open the **TestFlight** app, pick Wawona, and send **Beta Feedback**. Say what you tapped and what you saw. That is the Apple beta path. It does not include Wawona's in-app logs.

**GitHub with copied logs.** TestFlight mail is not a substitute for diagnostics. **Settings → About → Report a Bug on GitHub** copies logs and fills platform, version, and install channel. A scheduled importer also opens a GitHub issue from App Store Connect screenshot/crash feedback (tester identity and EXIF stripped). Paste copied logs on that issue if you have them.

TestFlight invites: [Wawona Discord](https://discord.gg/wHVSV52uw5).

## Apple (iOS, iPadOS, macOS, visionOS)

1. Reproduce once (Start the machine, wait a few seconds).
2. **Settings → About**.
3. Check **Version**, **Platform**, and **Install**.
4. **Report a Bug on GitHub**. The form opens with this platform, version, host OS, and recent logs filled. Write what happened.

On tvOS there is no clipboard. Report a Bug still fills platform. On watchOS it opens the form on the paired iPhone.

## Android and Linux

**Settings → About → Report a Bug on GitHub** copies the in-app log ring and opens the same form with Android or Linux filled. Attach `adb logcat` or a terminal capture if the ring is empty.

## Discord

[Wawona Discord](https://discord.gg/wHVSV52uw5) for TestFlight links and questions. If you already opened a GitHub issue, paste that URL in Discord.
