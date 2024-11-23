import { useEffect, useState } from "react";
import { cssObj } from "@fuel-ui/css";
import { Box, Heading, Link, List, Text } from "@fuel-ui/react";
import { useDocContext } from "~/src/hooks/useDocContext";

export function TableOfContent() {
  const { doc } = useDocContext();
  const { headings } = doc;

  const [currentHash, setCurrentHash] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHash(window.location.hash);

      const handleHashChange = () => {
        setCurrentHash(window.location.hash);
      };

      window.addEventListener("hashchange", handleHashChange);

      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observerOptions = {
      root: null, 
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentHash(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    const sections = headings.map((heading) =>
      document.getElementById(heading.id)
    );
    sections.forEach((section) => section && observer.observe(section));

    return () => {
      sections.forEach((section) => section && observer.unobserve(section));
    };
  }, [headings]);

  return (
    <Box css={styles.queries}>
      <Box css={styles.root}>
        <Heading as="h6">On this page</Heading>
        <List>
          {headings.map((heading) => (
            <List.Item key={heading.title}>
              <a
                href={`#${heading.id}`}
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
