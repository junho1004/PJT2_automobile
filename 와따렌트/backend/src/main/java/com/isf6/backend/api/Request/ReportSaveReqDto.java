package com.isf6.backend.api.Request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReportSaveReqDto {

    private String content;
    private Long reporter;


}
