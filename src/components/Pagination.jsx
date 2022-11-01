import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@100mslive/react-icons";
import { StyledPagination } from "@100mslive/react-ui";

export const Pagination = ({ page, setPage, numPages }) => {
  const disableLeft = page === 0;
  const disableRight = page === numPages - 1;
  const nextPage = () => {
    setPage(Math.min(page + 1, numPages - 1));
  };
  const prevPage = () => {
    setPage(Math.max(page - 1, 0));
  };
  return (
    <StyledPagination.Root>
      <StyledPagination.Chevron disabled={disableLeft} onClick={prevPage}>
        <ChevronLeftIcon
          width={16}
          height={16}
          style={{ cursor: disableLeft ? "not-allowed" : "pointer" }}
        />
      </StyledPagination.Chevron>
      <StyledPagination.Dots>
        {[...Array(numPages)].map((_, i) => (
          <StyledPagination.Dot
            key={i}
            active={page === i}
            onClick={() => setPage(i)}
          />
        ))}
      </StyledPagination.Dots>
      <StyledPagination.Chevron disabled={disableRight} onClick={nextPage}>
        <ChevronRightIcon
          width={16}
          height={16}
          style={{ cursor: disableRight ? "not-allowed" : "pointer" }}
        />
      </StyledPagination.Chevron>
    </StyledPagination.Root>
  );
};
