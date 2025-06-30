package com.example.employee_management.config;

import com.example.employee_management.dto.TrainingDTO;
import com.example.employee_management.entity.Training;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Strategy to match properties strictly to avoid unintended mappings
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        // Custom mapping for TrainingDTO -> Training entity
        PropertyMap<TrainingDTO, Training> trainingDtoToEntityMap = new PropertyMap<TrainingDTO, Training>() {
            @Override
            protected void configure() {
                // Explicitly map DTO's 'payment' field to Entity's 'paymentForTraining' field
                map(source.getPayment(), destination.getPaymentForTraining());
                // ModelMapper should map other fields with the same name automatically
                // if the matching strategy allows (STRICT requires exact name match).
                // If other fields also have different names, add explicit mappings for them too.
            }
        };
        modelMapper.addMappings(trainingDtoToEntityMap);

        // Custom mapping for Training entity -> TrainingDTO
        // This is important for when you return data to the frontend
        PropertyMap<Training, TrainingDTO> trainingEntityToDtoMap = new PropertyMap<Training, TrainingDTO>() {
            @Override
            protected void configure() {
                // Explicitly map Entity's 'paymentForTraining' field to DTO's 'payment' field
                map(source.getPaymentForTraining(), destination.getPayment());
            }
        };
        modelMapper.addMappings(trainingEntityToDtoMap);

        return modelMapper;
    }
}
