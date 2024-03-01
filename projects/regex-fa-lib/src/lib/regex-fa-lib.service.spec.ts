import { TestBed } from "@angular/core/testing";

import { RegexFaLibService } from "./regex-fa-lib.service";

describe("RegexFaLibService", () => {
  let service: RegexFaLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegexFaLibService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
