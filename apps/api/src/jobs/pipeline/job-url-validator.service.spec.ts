import { JobUrlValidatorService } from "./job-url-validator.service";
import { UrlValidationState, VerificationConfidence } from "@prisma/client";

describe("JobUrlValidatorService", () => {
  let service: JobUrlValidatorService;

  beforeEach(() => {
    service = new JobUrlValidatorService();
  });

  it("should recognize legitimate ATS and company career portal domains", () => {
    expect(
      service.isRecognizedPortal(
        "https://boards.greenhouse.io/stripe/jobs/12345",
      ),
    ).toBe(true);
    expect(
      service.isRecognizedPortal("https://jobs.lever.co/cred/abcdef"),
    ).toBe(true);
    expect(service.isRecognizedPortal("https://razorpay.com/jobs/sde")).toBe(
      true,
    );
    expect(
      service.isRecognizedPortal("https://careers.google.com/jobs/results"),
    ).toBe(true);
    expect(
      service.isRecognizedPortal("https://unknown-aggregator-scam.xyz/click"),
    ).toBe(false);
  });

  it("should mark invalid or empty URLs as INVALID", async () => {
    const result1 = await service.validateUrl("");
    expect(result1.validationState).toBe(UrlValidationState.INVALID);
    expect(result1.reason).toBe("MISSING_URL");

    const result2 = await service.validateUrl("ftp://invalid-protocol.com/job");
    expect(result2.validationState).toBe(UrlValidationState.INVALID);
    expect(result2.reason).toBe("UNSUPPORTED_PROTOCOL");

    const result3 = await service.validateUrl("not-a-valid-url");
    expect(result3.validationState).toBe(UrlValidationState.INVALID);
    expect(result3.reason).toBe("MALFORMED_URL");
  });

  it("should validate recognized ATS portals with COMPANY_PORTAL_MATCHED without HTTP request when checkHttp is false", async () => {
    const result = await service.validateUrl(
      "https://jobs.lever.co/cred/b3da0ae4",
      {
        checkHttp: false,
      },
    );

    expect(result.validationState).toBe(UrlValidationState.VERIFIED);
    expect(result.verificationConfidence).toBe(
      VerificationConfidence.COMPANY_PORTAL_MATCHED,
    );
    expect(result.isAtsPortal).toBe(true);
    expect(result.validatedApplyUrl).toBe(
      "https://jobs.lever.co/cred/b3da0ae4",
    );
  });
});
