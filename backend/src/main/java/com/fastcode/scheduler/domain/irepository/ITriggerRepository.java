package com.fastcode.scheduler.domain.irepository;


import com.fastcode.scheduler.domain.model.TriggerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository("triggerRepository")
public interface ITriggerRepository extends JpaRepository<TriggerEntity, Long> , QuerydslPredicateExecutor<TriggerEntity> {

}


