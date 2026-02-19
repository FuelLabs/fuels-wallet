import { useEffect, useState } from "react";
import { cssObj } from "@fuel-ui/css";
import { Box, Heading, Link, List, Text } from "@fuel-ui/react";
import { useDocContext } from "~/src/hooks/useDocContext";

export function TableOfContent() {
  const { doc } = useDocContext();
  const { headings } = doc;

  const [currentHash, setCurrentHash] = useState<string>("");
  const [userClicked, setUserClicked] = useState<boolean>(false);

  // Update the current hash based on window.location.hash on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHash(window.location.hash);
    }
  }, []);

  // Track hash changes when a user clicks on a link
  const handleClick = (hash: string) => {
    setUserClicked(true); // Indicate that the change is user-initiated
    setCurrentHash(hash); // Update the current hash
    setTimeout(() => setUserClicked(false), 1000); // Reset after a short delay
  };

  // Scroll observer for automatic highlighting during scrolling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observerOptions = {
      root: null, // Use the viewport
      rootMargin: "0px",
      threshold: Array.from({ length: 11 }, (_, i) => i / 10), // Threshold from 0.0 to 1.0
    };

    const sectionVisibility = new Map();

    const observer = new IntersectionObserver((entries) => {
      if (userClicked) return; // Skip if the user clicked a link recently

      entries.forEach((entry) => {
        sectionVisibility.set(entry.target.id, entry.intersectionRatio);
      });

      // Find the section with the highest visibility ratio
      let mostVisibleId = "";
      let maxVisibility = 0;
      sectionVisibility.forEach((visibility, id) => {
        if (visibility > maxVisibility) {
          mostVisibleId = id;
          maxVisibility = visibility;
        }
      });

      if (mostVisibleId) {
        setCurrentHash(`#${mostVisibleId}`);
      }
    }, observerOptions);

    // Flatten main headings and subheadings into a single list
    const allSections: any = [];
    headings.forEach((heading) => {
      allSections.push(heading);
      if (heading.children) {
        allSections.push(...heading.children);
      }
    });

    const sections = allSections.map((heading: any) =>
      document.getElementById(heading.id)
    );

    sections.forEach((section: any) => section && observer.observe(section));

    return () => {
      sections.forEach(
        (section: any) => section && observer.unobserve(section)
      );
    };
  }, [headings, userClicked]);

  return (
    <Box css={styles.queries}>
      <Box css={styles.root}>
        <Heading as="h6">On this page</Heading>
        <List>
          {headings.map((heading) => (
            <List.Item key={heading.title}>
              <a
                href={`#${heading.id}`}
                onClick={() => handleClick(`#${heading.id}`)} // Handle click events
                style={
                  currentHash === `#${heading.id}`
                    ? { color: "white", fontWeight: "bold" }
                    : {}
                }
              >
                {heading.title}
              </a>
              {heading.children && (
                <List type="ordered">
                  {heading.children.map((subHeading) => (
                    <List.Item key={subHeading.title}>
                      <a
                        href={`#${subHeading.id}`}
                        onClick={() => handleClick(`#${subHeading.id}`)} // Handle click events
                        style={
                          currentHash === `#${subHeading.id}`
                            ? { color: "white", fontWeight: "bold" }
                            : {}
                        }
                      >
                        {subHeading.title}
                      </a>
                    </List.Item>
                  ))}
                </List>
              )}
            </List.Item>
          ))}
        </List>
        <Text as="div" css={styles.feedback}>
          <Link
            isExternal
            href="https://github.com/fuellabs/fuels-wallet/issues/new/choose"
          >
            Questions? Give us feedback
          </Link>
          <Link isExternal href={doc.pageLink}>
            Edit this page
          </Link>
        </Text>
      </Box>
    </Box>
  );
}

const LIST_ITEM = ".fuel_List > .fuel_ListItem";

const styles = {
  queries: cssObj({
    display: "none",

    "@xl": {
      display: "block",
    },
  }),
  root: cssObj({
    position: "sticky",
    top: 0,
    py: "$8",
    pr: "$8",

    h6: {
      mt: 0,
    },

    [LIST_ITEM]: {
      pb: "$2",
      a: {
        fontWeight: "$normal",
        color: "$intentsBase11",
      },
    },
    [`${LIST_ITEM} > ${LIST_ITEM}:nth-child(1)`]: {
      pt: "$2",
    },
    [`${LIST_ITEM} > ${LIST_ITEM}`]: {
      a: {
        fontWeight: "$normal",
        color: "$intentsBase9",
      },
    },
  }),
  feedback: cssObj({
    display: "flex",
    flexDirection: "column",
    pt: "$3",
    borderTop: "1px solid $border",
    fontSize: "$sm",

    "a, a:visited": {
      color: "$intentsBase10",
    },
  }),
};
